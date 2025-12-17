/**
 * Helper function to render Prismic StructuredText content to HTML
 */

interface RichTextNode {
  type: string;
  text?: string;
  spans?: Array<{
    start: number;
    end: number;
    type: string;
    data?: any;
  }>;
  url?: string;
  alt?: string;
  copyright?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  items?: RichTextNode[];
}

export function renderRichText(content: any): string {
  if (!content) return '';
  
  // If it's already a string, return it
  if (typeof content === 'string') {
    return content;
  }

  // Debug: log the content structure
  if (typeof window === 'undefined') {
    // Server-side only
    console.log('Prismic content type:', typeof content);
    console.log('Prismic content is array:', Array.isArray(content));
    if (Array.isArray(content) && content.length > 0) {
      console.log('First block type:', content[0]?.type);
      console.log('First block:', JSON.stringify(content[0], null, 2));
    }
  }

  // If it's an array of blocks (StructuredText format)
  if (Array.isArray(content)) {
    let html = '';
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    
    for (let i = 0; i < content.length; i++) {
      const block = content[i];
      
      // Handle lists
      if (block.type === 'list-item' || block.type === 'o-list-item') {
        const currentListType = block.type === 'o-list-item' ? 'ol' : 'ul';
        
        if (!inList || listType !== currentListType) {
          // Close previous list if exists
          if (inList) {
            html += `</${listType}>`;
          }
          // Start new list
          html += `<${currentListType}>`;
          inList = true;
          listType = currentListType;
        }
        
        html += renderBlock(block);
      } else {
        // Close list if we were in one
        if (inList) {
          html += `</${listType}>`;
          inList = false;
          listType = null;
        }
        html += renderBlock(block);
      }
    }
    
    // Close list if still open
    if (inList && listType) {
      html += `</${listType}>`;
    }
    
    return html;
  }

  // If it's a single block
  if (content && typeof content === 'object') {
    return renderBlock(content);
  }

  return '';
}

function renderBlock(block: RichTextNode): string {
  if (!block || !block.type) return '';

  switch (block.type) {
    case 'paragraph':
      return `<p>${renderText(block)}</p>`;
    
    case 'heading1':
      return `<h1>${renderText(block)}</h1>`;
    
    case 'heading2':
      return `<h2>${renderText(block)}</h2>`;
    
    case 'heading3':
      return `<h3>${renderText(block)}</h3>`;
    
    case 'heading4':
      return `<h4>${renderText(block)}</h4>`;
    
    case 'heading5':
      return `<h5>${renderText(block)}</h5>`;
    
    case 'heading6':
      return `<h6>${renderText(block)}</h6>`;
    
    case 'list-item':
      return `<li>${renderText(block)}</li>`;
    
    case 'o-list-item':
      return `<li>${renderText(block)}</li>`;
    
    case 'preformatted':
      // Si el texto preformateado parece ser HTML (contiene tags), renderizarlo como HTML
      const preText = block.text || '';
      // Detectar si es HTML (tabla, div, párrafo, heading, thead, tbody, tr, td, th)
      // También detectar HTML escapado (&lt;table, &lt;div, etc.)
      const hasHtmlTags = preText.includes('<table') || preText.includes('<div') || preText.includes('<p') || 
          preText.includes('<h') || preText.includes('<thead') || preText.includes('<tbody') ||
          preText.includes('<tr') || preText.includes('<td') || preText.includes('<th') ||
          preText.includes('&lt;table') || preText.includes('&lt;div') || preText.includes('&lt;p') ||
          preText.includes('&lt;thead') || preText.includes('&lt;tbody') || preText.includes('&lt;tr') ||
          preText.includes('&lt;td') || preText.includes('&lt;th');
      
      if (hasHtmlTags) {
        // Es HTML, renderizarlo sin escapar pero limpiar comentarios HTML
        let cleanedHtml = preText.replace(/<!--[\s\S]*?-->/g, '');
        // Desescapar HTML si está escapado
        cleanedHtml = cleanedHtml
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
        return cleanedHtml;
      }
      // Si no es HTML, renderizarlo como código preformateado
      return `<pre>${escapeHtml(preText)}</pre>`;
    
    case 'image':
      const imgUrl = block.url || '';
      const imgAlt = block.alt || '';
      const imgDimensions = block.dimensions || { width: 0, height: 0 };
      return `<img src="${imgUrl}" alt="${escapeHtml(imgAlt)}" width="${imgDimensions.width}" height="${imgDimensions.height}" />`;
    
    case 'embed':
      const embedUrl = (block as any).oembed?.embed_url || (block as any).url || '';
      const embedHtml = (block as any).oembed?.html || '';
      if (embedHtml) {
        return `<div class="embed">${embedHtml}</div>`;
      }
      return embedUrl ? `<iframe src="${embedUrl}" frameborder="0"></iframe>` : '';
    
    case 'group':
      if (block.items && Array.isArray(block.items)) {
        return block.items.map(item => renderBlock(item)).join('');
      }
      return '';
    
    default:
      return renderText(block);
  }
}

function renderText(block: RichTextNode): string {
  if (!block.text) return '';
  
  let text = block.text;
  const spans = block.spans || [];
  
  // Sort spans by start position (reverse order to apply from end to start)
  const sortedSpans = [...spans].sort((a, b) => b.start - a.start);
  
  // Apply spans in reverse order to maintain correct positions
  for (const span of sortedSpans) {
    const before = text.substring(0, span.start);
    const content = text.substring(span.start, span.end);
    const after = text.substring(span.end);
    
    switch (span.type) {
      case 'strong':
        text = before + `<strong>${content}</strong>` + after;
        break;
      case 'em':
        text = before + `<em>${content}</em>` + after;
        break;
      case 'hyperlink':
        const url = span.data?.url || '';
        const target = span.data?.target || '_self';
        text = before + `<a href="${escapeHtml(url)}" target="${target}" rel="${target === '_blank' ? 'noopener noreferrer' : ''}">${content}</a>` + after;
        break;
      default:
        break;
    }
  }
  
  return text;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

