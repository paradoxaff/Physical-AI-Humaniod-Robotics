/**
 * Text selection utilities for AI context awareness
 */

/**
 * Get the currently selected text on the page
 * @returns {string} The selected text
 */
export const getSelectedText = () => {
  return window.getSelection?.().toString()?.trim() || '';
};

/**
 * Get the context around the selected text
 * @param {number} contextLength - Number of characters before/after selection
 * @returns {object} Object containing selected text and surrounding context
 */
export const getSelectedTextWithContext = (contextLength = 100) => {
  const selection = window.getSelection?.();
  if (!selection || selection.toString().trim() === '') {
    return { selectedText: '', context: '' };
  }

  const selectedText = selection.toString().trim();

  // Try to get the range to find surrounding context
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const startRange = document.createRange();
    const endRange = document.createRange();

    // Get start position (before selection)
    startRange.setStart(range.startContainer, 0);
    startRange.setEnd(range.startContainer, range.startOffset);
    const beforeText = startRange.toString();
    const beforeContext = beforeText.slice(-contextLength);

    // Get end position (after selection)
    endRange.setStart(range.endContainer, range.endOffset);
    endRange.setEnd(range.endContainer, range.endContainer.length);
    const afterText = endRange.toString();
    const afterContext = afterText.slice(0, contextLength);

    const context = `${beforeContext}${selectedText}${afterContext}`.trim();

    return {
      selectedText,
      context,
      beforeContext,
      afterContext
    };
  }

  return { selectedText, context: selectedText };
};

/**
 * Highlight selected text and provide context for AI
 * @param {string} selectedText - The text that was selected
 * @param {function} onHighlight - Callback function when text is highlighted
 */
export const highlightSelectedText = (selectedText, onHighlight) => {
  if (!selectedText) return;

  // Find all text nodes that contain the selection
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);

    // Create a temporary highlight element
    const highlight = document.createElement('span');
    highlight.style.backgroundColor = 'rgba(0, 247, 255, 0.3)';
    highlight.style.borderRadius = '2px';
    highlight.style.padding = '0 2px';

    // Surround the range with the highlight
    range.surroundContents(highlight);

    // Optional callback
    if (onHighlight) {
      onHighlight(selectedText, highlight);
    }
  }
};

/**
 * Get the current page context (URL, title, headings, etc.)
 * @returns {object} Page context information
 */
export const getPageContext = () => {
  return {
    url: window.location.href,
    pathname: window.location.pathname,
    title: document.title,
    headings: Array.from(document.querySelectorAll('h1, h2, h3, h4'))
      .map(heading => ({
        level: heading.tagName,
        text: heading.textContent.trim()
      })),
    // Get the first 200 characters of the page content as additional context
    contentPreview: document.body.textContent?.substring(0, 200)?.trim() || ''
  };
};

/**
 * Enhanced text selection handler that combines page context with selected text
 * @returns {object} Combined context for AI queries
 */
export const getEnhancedContext = () => {
  const selectedText = getSelectedText();
  const pageContext = getPageContext();
  const textWithContext = getSelectedTextWithContext(150);

  return {
    selectedText: selectedText,
    pageContext: pageContext,
    textWithContext: textWithContext,
    hasSelection: !!selectedText.trim(),
    fullContext: {
      ...pageContext,
      selectedText: selectedText,
      selectedTextContext: textWithContext.context
    }
  };
};