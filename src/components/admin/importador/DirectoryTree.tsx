import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { FileNode } from '@/types/githubImport';
import { cn } from '@/lib/utils';

interface DirectoryTreeProps {
  nodes: FileNode[];
  onSelectionChange: (nodes: FileNode[]) => void;
  onExpand: (node: FileNode) => Promise<FileNode[]>;
}

export function DirectoryTree({ nodes, onSelectionChange, onExpand }: DirectoryTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

  const handleToggleExpand = async (node: FileNode) => {
    if (node.type !== 'directory') return;

    const newExpanded = new Set(expandedNodes);
    
    if (expandedNodes.has(node.path)) {
      newExpanded.delete(node.path);
      setExpandedNodes(newExpanded);
    } else {
      if (!node.children || node.children.length === 0) {
        setLoadingNodes(new Set([...loadingNodes, node.path]));
        const children = await onExpand(node);
        node.children = children;
        setLoadingNodes(new Set([...loadingNodes].filter(p => p !== node.path)));
      }
      newExpanded.add(node.path);
      setExpandedNodes(newExpanded);
    }
  };

  const handleToggleSelection = (node: FileNode, checked: boolean) => {
    node.selected = checked;
    
    // Se for diretório, selecionar/desselecionar filhos
    if (node.type === 'directory' && node.children) {
      const toggleChildren = (children: FileNode[]) => {
        children.forEach(child => {
          child.selected = checked;
          if (child.children) {
            toggleChildren(child.children);
          }
        });
      };
      toggleChildren(node.children);
    }
    
    onSelectionChange([...nodes]);
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.path);
    const isLoading = loadingNodes.has(node.path);
    const hasChildren = node.type === 'directory';

    return (
      <div key={node.path}>
        <div
          className={cn(
            "flex items-center gap-2 py-1 px-2 hover:bg-accent rounded-sm",
            "transition-colors"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => handleToggleExpand(node)}
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {!hasChildren && <div className="w-4" />}
          
          <Checkbox
            checked={node.selected}
            onCheckedChange={(checked) => handleToggleSelection(node, checked as boolean)}
          />
          
          {hasChildren ? (
            <Folder className="h-4 w-4 text-muted-foreground" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          
          <span className="text-sm">{node.name}</span>
          
          {node.size && (
            <span className="text-xs text-muted-foreground ml-auto">
              {(node.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>

        {hasChildren && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-2 max-h-96 overflow-auto">
      {nodes.map(node => renderNode(node))}
    </div>
  );
}
