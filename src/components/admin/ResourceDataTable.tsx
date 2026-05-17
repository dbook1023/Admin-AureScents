import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Archive,
  Search,
  Filter,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useSearch } from '@/context/SearchContext';

interface Column<T> {
  header: string;
  accessor: keyof T | any;
  className?: string;
}

interface ResourceDataTableProps<T> {
  title: string;
  description: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit: (item: T) => void;
  editLabel?: string;
  onArchive: (item: T) => void;
  onUnarchive?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  searchPlaceholder?: string;
}

const ResourceDataTable = <T extends { id: string | number; status?: string }>({
  title,
  description,
  data,
  columns,
  onAdd,
  onEdit,
  editLabel = 'Update Entry',
  onArchive,
  onUnarchive,
  onDelete,
  onView,
  searchPlaceholder = "Search the repository..."
}: ResourceDataTableProps<T>) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [confirmAction, setConfirmAction] = useState<{ type: 'archive' | 'unarchive' | 'delete'; item: T } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search query
  const filteredData = searchQuery.trim()
    ? data.filter((item) => {
        const query = searchQuery.toLowerCase();
        return Object.values(item as Record<string, unknown>).some((value) => {
          if (value === null || value === undefined) return false;
          if (typeof value === 'string') return value.toLowerCase().includes(query);
          if (typeof value === 'number') return value.toString().includes(query);
          if (Array.isArray(value)) return value.some(v => String(v).toLowerCase().includes(query));
          return false;
        });
      })
    : data;

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'archive') {
      onArchive(confirmAction.item);
    } else if (confirmAction.type === 'unarchive' && onUnarchive) {
      onUnarchive(confirmAction.item);
    } else if (confirmAction.type === 'delete' && onDelete) {
      onDelete(confirmAction.item);
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-brand font-black text-white uppercase tracking-tight">{title}</h1>
          <p className="text-white/40 mt-1 font-medium text-sm">{description}</p>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="glass-button-active font-brand font-black text-[10px] uppercase tracking-widest h-11 px-8 rounded-xl shadow-2xl transition-premium w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Add New Entry
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative max-w-md w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#C5A059] transition-premium" />
          <Input 
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/5 text-white pl-12 h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-[#C5A059]/30 font-medium text-xs transition-premium placeholder:text-white/10"
          />
        </div>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Button variant="ghost" className="glass-button-ghost rounded-xl h-11 px-5 font-brand font-black text-[10px] uppercase tracking-widest transition-premium">
            <Filter className="w-4 h-4 mr-2" /> Filter Archive
          </Button>
          <div className="h-6 w-[1px] bg-white/5"></div>
          <p className="text-[10px] font-brand font-black text-white/20 uppercase tracking-[0.3em]">
            {filteredData.length} {filteredData.length === 1 ? 'Entry' : 'Entries'}
          </p>
        </div>
      </div>

      <Card className="glass-card rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.03] border-b border-white/5">
              <TableRow className="hover:bg-transparent border-white/5">
                {columns.map((col, idx) => (
                  <TableHead key={idx} className={`text-white/30 font-brand font-black uppercase text-[10px] tracking-[0.25em] py-6 ${idx === 0 ? 'pl-10' : ''}`}>
                    {col.header}
                  </TableHead>
                ))}
                <TableHead className="text-white/30 font-brand font-black uppercase text-[10px] tracking-[0.25em] pr-10 py-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow className="border-b border-white/5">
                  <TableCell colSpan={columns.length + 1} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-8 h-8 text-white/10" />
                      <p className="text-white/30 font-brand font-black text-[10px] uppercase tracking-[0.3em]">
                        {searchQuery ? 'No matching entries found' : 'No entries available'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className="border-b border-white/5 hover:bg-white/[0.04] transition-premium group">
                    {columns.map((col, idx) => (
                      <TableCell key={idx} className={`py-6 text-sm font-medium ${idx === 0 ? 'pl-10' : ''} ${col.className}`}>
                        {typeof col.accessor === 'function' 
                          ? (col.accessor as Function)(item) 
                          : <span className={cn(
                            "transition-premium",
                            idx === 0 ? "text-white font-bold group-hover:text-[#C5A059]" : "text-white/60"
                          )}>{(item[col.accessor as keyof T] as React.ReactNode)}</span>}
                      </TableCell>
                    ))}
                    <TableCell className="pr-10 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white/20 hover:text-white hover:bg-white/10 rounded-xl h-10 w-10 transition-premium">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card border-white/10 p-2 mt-2 w-64">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(item)} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-xl p-3 text-xs font-bold transition-premium text-white/70">
                              <Eye className="w-4 h-4 text-[#C5A059]" /> Open Encyclopedia
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onEdit(item)} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-xl p-3 text-xs font-bold transition-premium text-white/70">
                            <Edit className="w-4 h-4 text-[#C5A059]" /> {editLabel}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5 mx-1" />
                          {(item as any).is_archived && onUnarchive ? (
                            <DropdownMenuItem onClick={() => setConfirmAction({ type: 'unarchive', item })} className="flex items-center gap-3 cursor-pointer hover:bg-emerald-500/10 rounded-xl p-3 text-xs font-bold text-emerald-500 transition-premium">
                              <Archive className="w-4 h-4 rotate-180" /> Restore Item
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => setConfirmAction({ type: 'archive', item })} className="flex items-center gap-3 cursor-pointer hover:bg-[#C5A059]/10 rounded-xl p-3 text-xs font-bold text-[#C5A059] transition-premium">
                              <Archive className="w-4 h-4" /> Archive Item
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => setConfirmAction({ type: 'delete', item })} className="flex items-center gap-3 cursor-pointer hover:bg-red-500/10 rounded-xl p-3 text-xs font-bold text-red-500 transition-premium">
                            <Trash2 className="w-4 h-4" /> Delete Discovery
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 text-[10px] font-brand font-black text-white/20 uppercase tracking-[0.4em] text-center sm:text-left">
         <span className="hidden sm:inline">AURE SCENTS SCHOLARLY ARCHIVE</span>
         <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button 
                key={p} 
                onClick={() => setCurrentPage(p)}
                className={cn(
                  "w-8 h-8 rounded-xl transition-premium font-black text-[10px] shadow-2xl",
                  p === currentPage ? 'glass-button-active' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white'
                )}
              >
                {p}
              </button>
            ))}
         </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="glass-card border-white/10 rounded-3xl max-w-md text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                confirmAction?.type === 'delete' 
                  ? "bg-red-500/10 border border-red-500/20" 
                  : "bg-[#C5A059]/10 border border-[#C5A059]/20"
              )}>
                <AlertTriangle className={cn(
                  "w-6 h-6",
                  confirmAction?.type === 'delete' ? "text-red-500" : "text-[#C5A059]"
                )} />
              </div>
              <DialogTitle className="text-white font-brand font-black uppercase tracking-widest text-sm">
                {confirmAction?.type === 'delete' ? 'Confirm Deletion' : 'Confirm Archive'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/50 font-medium text-sm leading-relaxed">
              {confirmAction?.type === 'delete' 
                ? 'This action will permanently remove this entry from the database. This cannot be undone.'
                : 'This entry will be archived and hidden from the user-facing side, but will remain accessible in the admin panel.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setConfirmAction(null)}
              className="glass-button-ghost rounded-xl h-11 px-6 font-brand font-black text-[10px] uppercase tracking-widest transition-premium flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={cn(
                "rounded-xl h-11 px-6 font-brand font-black text-[10px] uppercase tracking-widest transition-premium flex-1",
                confirmAction?.type === 'delete'
                  ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                  : "glass-button-active"
              )}
            >
              {confirmAction?.type === 'delete' ? 'Delete Permanently' : 'Archive Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceDataTable;

