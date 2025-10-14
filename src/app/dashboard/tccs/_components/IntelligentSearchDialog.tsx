"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  TrendingUp,
  BookOpen,
  User,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResult {
  id: string;
  title: string;
  year: number;
  type: "BACHELOR" | "MASTER" | "DOCTORATE";
  keywords: string | null;
  author: {
    firstName: string;
    lastName: string;
  };
  supervisor: string | null;
  course: {
    name: string;
  };
  relevanceScore: number;
  matchedFields: string[];
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

interface IntelligentSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTCC: (tcc: SearchResult) => void;
}

const typeLabels = {
  BACHELOR: "Monografia",
  MASTER: "Dissertação",
  DOCTORATE: "Tese",
};

const typeColors = {
  BACHELOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  MASTER:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DOCTORATE:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export function IntelligentSearchDialog({
  open,
  onOpenChange,
  onSelectTCC,
}: IntelligentSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 800);

  // Load search history on mount
  useEffect(() => {
    if (open) {
      loadSearchHistory();
    }
  }, [open]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const loadSearchHistory = async () => {
    try {
      const response = await api.get("/api/tccs/search/history");
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  };

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await api.post("/api/tccs/search/intelligent", {
        query: searchQuery,
      });

      if (response.data.success) {
        setResults(response.data.data);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error("Error performing search:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectTCC(result);
    onOpenChange(false);
    setQuery("");
    setResults([]);
  };

  const handleHistoryClick = (historyItem: SearchHistory) => {
    setQuery(historyItem.query);
  };

  const clearHistory = async () => {
    try {
      await api.delete("/api/tccs/search/history");
      setHistory([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectResult(results[selectedIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto  sm:mx-auto">
        <DialogHeader className="p-4 md:p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Busca Inteligente de TCCs
          </DialogTitle>
          <DialogDescription>
            Encontre trabalhos usando busca semântica baseada em título, autor,
            orientador, palavras-chave e conteúdo
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Digite sua busca... (ex: 'machine learning', 'João Silva', 'inteligência artificial')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px]">
            <div className="pb-6">
              {/* Search Results */}
              {query.trim() && (
                <div className="space-y-4">
                  {results.length > 0 && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resultados ({results.length})
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp className="h-3 w-3" />
                        Ordenado por relevância
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedIndex === index
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          onClick={() => handleSelectResult(result)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Title and Type */}
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                                  {result.title}
                                </h4>
                                <Badge className={typeColors[result.type]}>
                                  {typeLabels[result.type]}
                                </Badge>
                              </div>

                              {/* Author and Supervisor */}
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {result.author.firstName}{" "}
                                  {result.author.lastName}
                                </div>
                                {result.supervisor && (
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {result.supervisor}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {result.year}
                                </div>
                              </div>

                              {/* Course and Keywords */}
                              <div className="space-y-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Curso:</span>{" "}
                                  {result.course.name}
                                </div>
                                {result.keywords && (
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">
                                      Palavras-chave:
                                    </span>{" "}
                                    {result.keywords}
                                  </div>
                                )}
                              </div>

                              {/* Matched Fields and Relevance */}
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {(result.matchedFields || []).map((field) => (
                                    <Badge
                                      key={field}
                                      variant="outline"
                                      className="text-xs px-2 py-0"
                                    >
                                      {field}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {Math.round(
                                    (result.relevanceScore || 0) * 100
                                  )}
                                  % relevante
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {results.length === 0 && !loading && query.trim() && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        Nenhum resultado encontrado
                      </p>
                      <p className="text-sm">
                        Tente usar termos diferentes ou mais específicos
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Search History */}
              {!query.trim() && history.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Buscas Recentes
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {history.map((item) => (
                      <Card
                        key={item.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{item.query}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{item.resultsCount} resultados</span>
                              <span>•</span>
                              <span>
                                {new Date(item.timestamp).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!query.trim() && history.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Busca Inteligente</p>
                  <p className="text-sm max-w-md mx-auto">
                    Digite para buscar TCCs por título, autor, orientador,
                    palavras-chave ou conteúdo. A busca usa inteligência
                    artificial para encontrar os melhores resultados.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
