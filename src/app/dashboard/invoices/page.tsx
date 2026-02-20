'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FileText, 
  Plus, 
  Search, 
  DollarSign, 
  Printer, 
  Trash2, 
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  User,
  MapPin,
  Phone,
  Layers,
  Download,
  Share2
} from 'lucide-react';

interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
}

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  type: 'Sale' | 'Rental' | 'Consultancy';
  items: InvoiceItem[];
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', qty: 1, price: 0 }]);
  const [status, setStatus] = useState<Invoice['status']>('Pending');

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('subnaka_invoices');
    if (saved) {
      setInvoices(JSON.parse(saved));
    } else {
      setInvoices([
        { 
            id: 'INV-2025-001', 
            clientName: 'Somsack Keo', 
            clientEmail: 'somsack@mail.la', 
            clientAddress: 'Vientiane, Laos',
            clientPhone: '+856 20 5555 5555',
            amount: 1000000, 
            date: '27/10/2023', 
            status: 'Paid', 
            type: 'Consultancy', 
            items: [{ description: 'Consulting Service / ຄ່າບໍລິການທີ່ປຶກສາ', qty: 1, price: 1000000 }] 
        },
      ]);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('subnaka_invoices', JSON.stringify(invoices));
    }
  }, [invoices, isLoaded]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 8999)}`,
      clientName,
      clientEmail,
      clientAddress,
      clientPhone,
      amount: totalAmount,
      date: new Date().toLocaleDateString('en-GB'),
      status,
      type: 'Sale',
      items,
    };
    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    resetForm();
    triggerToast('Invoice generated successfully!');
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientAddress('');
    setClientPhone('');
    setItems([{ description: '', qty: 1, price: 0 }]);
    setStatus('Pending');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDownloadPDF = async (invoiceToDownload?: Invoice) => {
    const inv = invoiceToDownload || selectedInvoice;
    if (!inv) return;
    
    // Set the invoice to ensure it's rendered somewhere
    setSelectedInvoice(inv);
    
    // We need to wait for React to finish rendering the element
    // before we try to capture it. 
    await new Promise(resolve => setTimeout(resolve, 300));

    const html2pdf = (await import('html2pdf.js')).default;
    
    // Try to find the element in the modal first, then the hidden one
    const element = document.getElementById('invoice-sheet') || document.getElementById('invoice-sheet-hidden');
    
    if (!element) {
        console.error('Invoice sheet element not found');
        triggerToast('Error: Please open preview first');
        return;
    }

    const opt = {
      margin: 0,
      filename: `${inv.id}_${inv.clientName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        onclone: (clonedDoc: Document) => {
          const sheet = clonedDoc.getElementById('invoice-sheet') || clonedDoc.getElementById('invoice-sheet-hidden');
          if (sheet) {
            sheet.style.display = 'block';
            sheet.style.visibility = 'visible';
            sheet.style.position = 'relative';
            sheet.style.left = '0';
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      triggerToast('Downloading PDF...');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      triggerToast('Generation failed. Try Print.');
    }
  };

  const handleShare = async () => {
    if (!selectedInvoice) return;
    const shareText = `Invoice ${selectedInvoice.id} for ${selectedInvoice.clientName}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Subnaka Invoice', text: shareText, url: window.location.href }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      triggerToast('Invoice details copied!');
    }
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const openPreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices.filter(i => i.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoices.filter(i => i.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0),
  };

  const InvoiceSheet = ({ invoice, id }: { invoice: Invoice, id: string }) => (
    <div id={id} style={{ backgroundColor: '#ffffff', color: '#0f172a', width: '210mm', minHeight: '297mm', padding: '15mm' }} className="mx-auto flex flex-col font-sans overflow-hidden print:m-0 print:p-[15mm]">
        <header style={{ borderBottom: '6px solid #eab308' }} className="flex justify-between items-start pb-6 mb-8">
            <div className="w-2/3">
                <p style={{ color: '#0f172a' }} className="text-[14px] font-bold leading-tight mb-1">ບໍລິສັດ ຊັບນາຄາ ພັດທະນາ ອະສັງຫາລິມະຊັບ ຈຳກັດຜູ້ດຽວ</p>
                <h1 style={{ color: '#ca8a04' }} className="text-[18px] font-black uppercase tracking-tight leading-none mb-3">SUBNAKA DEVELOPMENT REAL ESTATE SOLE CO., LTD</h1>
                <div style={{ color: '#64748b' }} className="text-[10px] leading-relaxed">
                    <p><strong>Head Office:</strong> ບ້ານ ນາຄຳ, ເມືອງ ສີໂຄດຕະບອງ, ນະຄອນຫຼວງ ວຽງຈັນ, ສປປ ລາວ</p>
                    <p>Ban Nakham, Sikhotthabong District, Vientiane Capital, Lao PDR</p>
                    <p><strong>Email:</strong> finance@subnaka.la | <strong>Website:</strong> subnaka.la</p>
                </div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }} className="w-28 h-28 flex items-center justify-center rounded-xl border overflow-hidden">
                <Image src="/logo%20new.png" alt="Logo" width="112" height="112" className="max-w-full h-auto p-2" />
            </div>
        </header>

        <div className="text-center mb-8">
            <h2 style={{ color: '#eab308' }} className="text-[40px] font-black mb-0 leading-none">INVOICE</h2>
            <p style={{ color: '#94a3b8' }} className="text-[12px] font-black uppercase tracking-[4px]">ໃບບິນເກັບເງິນ</p>
        </div>

        <div className="flex justify-between gap-8 mb-10">
            <div className="flex-1">
                <h3 style={{ color: '#0f172a', borderBottom: '1px solid #eab308' }} className="text-[10px] font-black pb-1 mb-3 uppercase tracking-wider">BILL TO (ລູກຄ້າ):</h3>
                <div className="space-y-2 text-[12px] font-medium">
                    <div style={{ borderBottom: '1px dotted #e2e8f0' }} className="flex pb-1"><span style={{ color: '#94a3b8' }} className="w-16 font-black text-[8px] uppercase">Name:</span><span style={{ color: '#0f172a' }}>{invoice.clientName}</span></div>
                    <div style={{ borderBottom: '1px dotted #e2e8f0' }} className="flex pb-1"><span style={{ color: '#94a3b8' }} className="w-16 font-black text-[8px] uppercase">Address:</span><span style={{ color: '#0f172a' }}>{invoice.clientAddress}</span></div>
                    <div style={{ borderBottom: '1px dotted #e2e8f0' }} className="flex pb-1"><span style={{ color: '#94a3b8' }} className="w-16 font-black text-[8px] uppercase">Phone:</span><span style={{ color: '#0f172a' }}>{invoice.clientPhone}</span></div>
                </div>
            </div>
            <div className="flex-1">
                <h3 style={{ color: '#0f172a', borderBottom: '1px solid #eab308' }} className="text-[10px] font-black pb-1 mb-3 uppercase tracking-wider">DETAILS (ລາຍລະອຽດ):</h3>
                <div className="space-y-2 text-[12px] font-medium">
                    <div style={{ borderBottom: '1px dotted #e2e8f0' }} className="flex pb-1"><span style={{ color: '#94a3b8' }} className="w-20 font-black text-[8px] uppercase">Invoice No:</span><span style={{ color: '#ca8a04' }} className="font-bold">{invoice.id}</span></div>
                    <div style={{ borderBottom: '1px dotted #e2e8f0' }} className="flex pb-1"><span style={{ color: '#94a3b8' }} className="w-20 font-black text-[8px] uppercase">Date:</span><span style={{ color: '#0f172a' }}>{invoice.date}</span></div>
                    <div style={{ borderBottom: '1px dotted #e2e8f0' }} className="flex pb-1"><span style={{ color: '#94a3b8' }} className="w-20 font-black text-[8px] uppercase">Due Date:</span><span style={{ color: '#0f172a' }}>Upon Receipt</span></div>
                </div>
            </div>
        </div>

        <div className="flex-grow">
            <table className="w-full text-left mb-8 border-collapse">
                <thead>
                    <tr style={{ backgroundColor: '#eab308', color: '#ffffff' }}>
                        <th className="px-3 py-2 text-[8px] font-black uppercase tracking-wider w-8 text-center">No.</th>
                        <th className="px-3 py-2 text-[8px] font-black uppercase tracking-wider">Description / ລາຍການ</th>
                        <th className="px-3 py-2 text-[8px] font-black uppercase tracking-wider w-12 text-center">Qty</th>
                        <th className="px-3 py-2 text-[8px] font-black uppercase tracking-wider w-24 text-right">Unit Price (₭)</th>
                        <th className="px-3 py-2 text-[8px] font-black uppercase tracking-wider w-24 text-right">Total (₭)</th>
                    </tr>
                </thead>
                <tbody style={{ borderBottom: '1px solid #e2e8f0' }} className="divide-y divide-slate-200">
                    {invoice.items.map((item, i) => (
                        <tr key={i} className="text-[12px] font-medium">
                            <td style={{ color: '#94a3b8' }} className="px-3 py-3 text-center">{i + 1}</td>
                            <td style={{ color: '#0f172a' }} className="px-3 py-3">{item.description}</td>
                            <td style={{ color: '#0f172a' }} className="px-3 py-3 text-center">{item.qty}</td>
                            <td style={{ color: '#0f172a' }} className="px-3 py-3 text-right">₭{item.price.toLocaleString()}</td>
                            <td style={{ color: '#0f172a' }} className="px-3 py-3 text-right font-bold">₭{(item.qty * item.price).toLocaleString()}</td>
                        </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 10 - invoice.items.length) }).map((_, i) => (
                        <tr key={i + 10} className="h-10"><td></td><td></td><td></td><td></td><td></td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end mb-10">
            <table style={{ width: '85mm' }} className="border-collapse">
                <tbody className="text-[12px]">
                    <tr><td style={{ color: '#94a3b8' }} className="py-1.5 pr-4 text-right font-black text-[8px] uppercase">Subtotal / ລວມ:</td><td style={{ borderBottom: '1px solid #f1f5f9', color: '#0f172a' }} className="py-1.5 text-right font-bold">₭{invoice.amount.toLocaleString()}</td></tr>
                    <tr><td style={{ color: '#94a3b8' }} className="py-1.5 pr-4 text-right font-black text-[8px] uppercase">VAT (10%) / ອາກອນ:</td><td style={{ borderBottom: '1px solid #f1f5f9', color: '#0f172a' }} className="py-1.5 text-right font-bold">₭{(invoice.amount * 0.1).toLocaleString()}</td></tr>
                    <tr style={{ backgroundColor: '#0f172a', color: '#ffffff' }}><td style={{ color: '#eab308' }} className="py-2.5 pr-4 text-right font-black text-[10px] uppercase">Grand Total:</td><td className="py-2.5 text-right font-black text-[18px] pr-3">₭{(invoice.amount * 1.1).toLocaleString()}</td></tr>
                </tbody>
            </table>
        </div>

        <footer style={{ borderTop: '1px solid #f1f5f9' }} className="mt-auto flex justify-between pt-8">
            <div className="w-2/3">
                <h3 style={{ color: '#0f172a' }} className="text-[8px] font-black uppercase tracking-wider mb-2">PAYMENT INFO / ຂໍ້ມູນການຊຳລະ:</h3>
                <div style={{ color: '#475569' }} className="text-[10px] space-y-0.5 font-medium leading-tight">
                    <p><strong>Bank Name:</strong> BCEL (Banque pour le Commerce Exterieur Lao Public)</p>
                    <p><strong>Account Name:</strong> SUBNAKA DEVELOPMENT REAL ESTATE SOLE CO., LTD</p>
                    <p><strong>Account No:</strong> 160120001024XXXXXX</p>
                </div>
                <p style={{ color: '#cbd5e1' }} className="mt-4 text-[9px] font-black uppercase italic">Thank you for your business!</p>
            </div>
            <div className="w-40 text-center pt-6">
                <div style={{ borderBottom: '1px solid #0f172a' }} className="mb-1"></div>
                <strong style={{ color: '#0f172a' }} className="text-[9px] uppercase tracking-wider">Authorized Signature</strong>
                <p style={{ color: '#94a3b8' }} className="text-[8px] mt-0.5 leading-none">ລາຍເຊັນຜູ້ອະນຸມັດ</p>
            </div>
        </footer>
    </div>
  );

  return (
    <div className="p-8">
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          #invoice-sheet { 
            position: fixed !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 210mm !important; 
            height: 297mm !important; 
            margin: 0 !important; 
            padding: 0 !important;
            visibility: visible !important; 
            z-index: 9999 !important;
            background: white !important;
          }
          body * { visibility: hidden; }
          #invoice-sheet, #invoice-sheet * { visibility: visible; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Main Dashboard UI */}
      <div className="flex justify-between items-center mb-8 no-print">
        <div><h1 className="text-3xl font-black text-slate-800 tracking-tight">Invoice Generator</h1><p className="text-slate-500 font-medium">Official Subnaka branded invoices</p></div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-yellow-600 transition-all active:scale-95"><Plus className="w-5 h-5" /> Create Invoice</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 no-print">
        <StatCard title="Total Invoiced" value={`₭${stats.total.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} color="blue" />
        <StatCard title="Paid" value={`₭${stats.paid.toLocaleString()}`} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatCard title="Pending" value={`₭${stats.pending.toLocaleString()}`} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatCard title="Overdue" value={`₭${stats.overdue.toLocaleString()}`} icon={<AlertCircle className="w-5 h-5" />} color="red" />
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden no-print">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Recent Activity</h3>
            <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search invoices..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 outline-none w-64 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-slate-100"><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">{inv.id}</td>
                  <td className="px-8 py-5 text-slate-900"><p className="font-bold text-sm">{inv.clientName}</p></td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">₭{inv.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-right"><div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all"><button onClick={() => openPreview(inv)} className="p-2 text-slate-400 hover:text-yellow-600 transition-all"><Eye className="w-4 h-4" /></button><button onClick={() => handleDownloadPDF(inv)} className="p-2 text-slate-400 hover:text-slate-600 transition-all"><Download className="w-4 h-4" /></button><button onClick={() => deleteInvoice(inv.id)} className="p-2 text-slate-400 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALWAYS RENDER THE HIDDEN SHEET IF SELECTED */}
      {selectedInvoice && (
        <div className="fixed -left-[9999px] top-0 no-print" aria-hidden="true">
            <InvoiceSheet invoice={selectedInvoice} id="invoice-sheet-hidden" />
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && selectedInvoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-slate-100 rounded-xl w-full max-w-[215mm] p-6 shadow-2xl relative my-auto animate-in zoom-in duration-200 flex flex-col print:p-0 print:bg-white print:shadow-none print:w-full print:max-w-none">
            <div className="p-4 bg-white border border-slate-200 rounded-xl mb-4 flex justify-between items-center print:hidden">
                <div className="flex gap-3"><button onClick={() => handleDownloadPDF()} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all"><Download className="w-4 h-4" /> Download PDF</button><button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"><Printer className="w-4 h-4" /> Print (A4)</button><button onClick={handleShare} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"><Share2 className="w-4 h-4" /> Share</button></div>
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-white shadow-2xl mx-auto print:shadow-none"><InvoiceSheet invoice={selectedInvoice} id="invoice-sheet" /></div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-8 shadow-2xl border border-slate-100 my-auto">
            <div className="flex justify-between items-center mb-8"><div className="flex items-center gap-4"><div className="bg-yellow-500 p-3 rounded-2xl shadow-lg"><FileText className="text-white w-6 h-6" /></div><div><h2 className="text-2xl font-black text-slate-800 tracking-tight">New Invoice</h2><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subnaka Official Template</p></div></div><button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X /></button></div>
            <form className="space-y-6 text-slate-900" onSubmit={handleCreateInvoice}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Client Name</label><input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-slate-900" placeholder="Full Name" required /></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Email</label><input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-slate-900" placeholder="client@mail.com" required /></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Address</label><input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-slate-900" placeholder="Vientiane, Laos" required /></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Phone</label><input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-slate-900" placeholder="+856 20 ..." required /></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase">Status</label><select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-5 py-3 bg-slate-900 text-white rounded-xl outline-none font-bold appearance-none cursor-pointer"><option value="Pending">Pending Payment</option><option value="Paid">Mark as Paid</option></select></div>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Items</h3><button type="button" onClick={() => setItems([...items, { description: '', qty: 1, price: 0 }])} className="text-[10px] font-black text-yellow-600 uppercase">+ Add Item</button></div>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item, index) => (<div key={index} className="grid grid-cols-12 gap-2 bg-slate-50 p-3 rounded-xl"><div className="col-span-6"><input type="text" value={item.description} onChange={(e) => { const n = [...items]; n[index].description = e.target.value; setItems(n); }} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" placeholder="Service" required /></div><div className="col-span-2"><input type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[index].qty = parseFloat(e.target.value) || 0; setItems(n); }} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-900" required /></div><div className="col-span-3"><input type="number" value={item.price} onChange={(e) => { const n = [...items]; n[index].price = parseFloat(e.target.value) || 0; setItems(n); }} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900" placeholder="₭" required /></div><div className="col-span-1 flex justify-center items-center"><button type="button" onClick={() => items.length > 1 && setItems(items.filter((_, i) => i !== index))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div></div>))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                 <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total (Inc. VAT)</p><p className="text-2xl font-black text-slate-900">₭{(items.reduce((s, i) => s + (i.qty * i.price), 0) * 1.1).toLocaleString()}</p></div>
                 <button type="submit" className="bg-yellow-500 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-yellow-600 transition-all active:scale-95">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom border border-slate-800"><div className="bg-green-500 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-white" /></div><p className="font-bold text-sm">{toastMessage}</p></div>
      )}
    </div>
  );
}

const StatCard = ({ title, value, icon, color }: any) => {
  const colors: any = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', yellow: 'bg-yellow-50 text-yellow-600', red: 'bg-red-50 text-red-600' };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{title}</p><p className="text-2xl font-black text-slate-800">{value}</p></div>
    </div>
  );
};
