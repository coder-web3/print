import React, { useState, useEffect, useRef } from 'react';
import './WordPressClassicBlogEditor.css';
import { BLOG_CATEGORIES } from '../../data/blogData';

/**
 * Helper to convert legacy contentSections into clean HTML for WordPress Classic Editor
 */
export function sectionsToHtml(sections = [], quote = '') {
  let html = '';
  if (Array.isArray(sections) && sections.length > 0) {
    sections.forEach((sec, idx) => {
      if (sec.heading) {
        const cleanId = sec.id || sec.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        html += `<h2 id="${cleanId}">${sec.heading}</h2>\n`;
      }
      if (sec.body) {
        const paragraphs = sec.body.split(/\n\s*\n/).filter(Boolean);
        if (paragraphs.length > 0) {
          paragraphs.forEach((p) => {
            html += `<p>${p.trim()}</p>\n`;
          });
        } else {
          html += `<p>${sec.body.trim()}</p>\n`;
        }
      }
      if (idx === 0 && quote) {
        html += `<blockquote class="wp-block-quote"><p>“${quote}”</p></blockquote>\n`;
      }
    });
  }
  return html.trim();
}

/**
 * Helper to extract Table of Contents and fallback sections from HTML
 */
export function extractTocAndSectionsFromHtml(html = '') {
  if (typeof window === 'undefined' || !html) {
    return { toc: [], sections: [] };
  }

  const container = document.createElement('div');
  container.innerHTML = html;

  const headings = container.querySelectorAll('h2, h3');
  const toc = [];
  const sections = [];

  headings.forEach((h, index) => {
    let id = h.getAttribute('id');
    if (!id) {
      id = h.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `section-${index + 1}`;
      h.setAttribute('id', id);
    }
    const label = h.textContent.trim();
    if (label) {
      toc.push({ id, label });

      // Find subsequent paragraph text until next heading
      let bodyText = '';
      let sibling = h.nextElementSibling;
      while (sibling && !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(sibling.tagName)) {
        if (sibling.tagName === 'P') {
          bodyText += (bodyText ? '\n\n' : '') + sibling.textContent.trim();
        }
        sibling = sibling.nextElementSibling;
      }

      sections.push({
        id,
        heading: label,
        body: bodyText || label
      });
    }
  });

  return {
    toc,
    sections,
    normalizedHtml: container.innerHTML
  };
}

export default function WordPressClassicBlogEditor({
  post = null,
  onSave = () => {},
  onClose = () => {},
  onPreview = () => {},
  showNotification = () => {}
}) {
  // Post data state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState(post?.slug || '');

  // Rich HTML content state
  const [contentHtml, setContentHtml] = useState(() => {
    if (post?.contentHtml) return post.contentHtml;
    if (post?.contentSections?.length > 0) {
      return sectionsToHtml(post.contentSections, post.quote);
    }
    return '<p>Write your article introduction here...</p>';
  });

  // Editor mode: 'visual' | 'text'
  const [editorMode, setEditorMode] = useState('visual');
  const [showKitchenSink, setShowKitchenSink] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Meta box fields
  const [status, setStatus] = useState(post?.status || 'published');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt || 'Oct 18, 2026');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [category, setCategory] = useState(post?.category || 'Engagement');
  const [categorySlug, setCategorySlug] = useState(post?.categorySlug || 'occasions');
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [quote, setQuote] = useState(post?.quote || '');
  const [readTime, setReadTime] = useState(post?.readTime || '5 min read');
  const [trending, setTrending] = useState(Boolean(post?.trending));
  const [trendingRank, setTrendingRank] = useState(post?.trendingRank || 1);

  // Collapsible boxes state
  const [collapsedBoxes, setCollapsedBoxes] = useState({
    publish: false,
    categories: false,
    featuredImage: false,
    excerpt: false,
    articleOptions: false,
    tocPreview: false
  });

  // Media Modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState('url'); // 'url' | 'presets'
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAlt, setMediaAlt] = useState('');
  const [mediaAlign, setMediaAlign] = useState('none'); // 'none' | 'left' | 'center' | 'right'
  const [mediaCaption, setMediaCaption] = useState('');

  // Link Modal state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  // New Category inline input
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Refs
  const visualEditorRef = useRef(null);
  const textareaRef = useRef(null);
  const [savedTime, setSavedTime] = useState('');

  // Initialize visual canvas content
  useEffect(() => {
    if (visualEditorRef.current && editorMode === 'visual') {
      visualEditorRef.current.innerHTML = contentHtml;
    }
  }, [editorMode]);

  // Calculate live word count
  const wordCount = React.useMemo(() => {
    const text = contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
  }, [contentHtml]);

  // Synchronize visual content changes
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setContentHtml(visualEditorRef.current.innerHTML);
    }
  };

  // Toggle editor mode
  const handleSwitchMode = (mode) => {
    if (mode === editorMode) return;
    if (mode === 'text') {
      // Sync from Visual to Text
      if (visualEditorRef.current) {
        setContentHtml(visualEditorRef.current.innerHTML);
      }
    } else {
      // Sync from Text to Visual
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = contentHtml;
      }
    }
    setEditorMode(mode);
  };

  // Execute standard formatting commands in Visual mode
  const execCmd = (command, value = null) => {
    if (editorMode !== 'visual') return;
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleVisualInput();
  };

  // Quicktag insertion for Text (HTML) mode
  const insertQuicktag = (openTag, closeTag = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = closeTag ? `${openTag}${selected}${closeTag}` : openTag;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    setContentHtml(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + openTag.length;
      textarea.selectionEnd = start + openTag.length + selected.length;
    }, 10);
  };

  // Insert image from Media Modal
  const handleInsertMedia = () => {
    if (!mediaUrl.trim()) return;
    let imgTag = `<img src="${mediaUrl.trim()}" alt="${mediaAlt || title}"`;
    if (mediaAlign !== 'none') {
      imgTag += ` class="align${mediaAlign}" style="margin: 12px ${mediaAlign === 'center' ? 'auto' : '16px'}; display: ${mediaAlign === 'center' ? 'block' : 'inline-block'};"`;
    }
    imgTag += ' />';

    if (mediaCaption.trim()) {
      imgTag = `<figure class="wp-caption">${imgTag}<figcaption class="wp-caption-text">${mediaCaption.trim()}</figcaption></figure>`;
    }

    if (editorMode === 'visual') {
      execCmd('insertHTML', imgTag);
    } else {
      insertQuicktag(imgTag);
    }

    setIsMediaModalOpen(false);
    setMediaUrl('');
    setMediaAlt('');
    setMediaCaption('');
  };

  // Insert link from Link Modal
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const anchorHtml = `<a href="${linkUrl.trim()}"${targetAttr}>${linkText.trim() || linkUrl.trim()}</a>`;

    if (editorMode === 'visual') {
      execCmd('insertHTML', anchorHtml);
    } else {
      insertQuicktag(anchorHtml);
    }

    setIsLinkModalOpen(false);
    setLinkUrl('https://');
    setLinkText('');
  };

  // Toggle collapsible boxes
  const toggleBox = (boxKey) => {
    setCollapsedBoxes((prev) => ({ ...prev, [boxKey]: !prev[boxKey] }));
  };

  // Save Post
  const handlePublishOrUpdate = (forcedStatus = null) => {
    if (!title.trim()) {
      alert('Please enter an article title before publishing.');
      return;
    }

    const effectiveStatus = forcedStatus || status;
    const rawSlug = (slug || title).trim();
    const finalSlug = rawSlug
      .toLowerCase()
      .replace(/^\/?blog\//i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Extract Table of Contents and fallback sections from HTML
    const { toc, sections, normalizedHtml } = extractTocAndSectionsFromHtml(contentHtml);

    const updatedPost = {
      ...(post || {}),
      id: post?.id || `post-${Date.now()}`,
      title: title.trim(),
      slug: finalSlug,
      category,
      categorySlug,
      status: effectiveStatus,
      publishedAt,
      featuredImage: featuredImage.trim(),
      excerpt: excerpt.trim(),
      quote: quote.trim(),
      readTime: readTime.trim() || `${Math.max(1, Math.ceil(wordCount / 180))} min read`,
      trending,
      trendingRank: trending ? Number(trendingRank) || 1 : null,
      contentHtml: normalizedHtml || contentHtml,
      tableOfContents: toc.length > 0 ? toc : (post?.tableOfContents || []),
      contentSections: sections.length > 0 ? sections : (post?.contentSections || [])
    };

    onSave(updatedPost);
    setSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    if (showNotification) {
      showNotification(
        'success',
        effectiveStatus === 'published' ? 'Post Published!' : 'Draft Saved!',
        `"${title}" has been saved with WordPress Classic formatting.`
      );
    }
  };

  // Preview Post (auto-saves draft first so storefront tab immediately finds the article)
  const handlePreviewClick = () => {
    const rawSlug = (slug || title).trim();
    const finalSlug = rawSlug
      .toLowerCase()
      .replace(/^\/?blog\//i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `preview-${Date.now()}`;

    const { toc, sections, normalizedHtml } = extractTocAndSectionsFromHtml(contentHtml);

    const draftPost = {
      ...(post || {}),
      id: post?.id || `post-${Date.now()}`,
      title: title.trim() || 'Untitled Article',
      slug: finalSlug,
      category,
      categorySlug,
      status: status || 'draft',
      publishedAt,
      featuredImage: featuredImage.trim(),
      excerpt: excerpt.trim(),
      quote: quote.trim(),
      readTime: readTime.trim() || `${Math.max(1, Math.ceil(wordCount / 180))} min read`,
      trending,
      trendingRank: trending ? Number(trendingRank) || 1 : null,
      contentHtml: normalizedHtml || contentHtml,
      tableOfContents: toc.length > 0 ? toc : (post?.tableOfContents || []),
      contentSections: sections.length > 0 ? sections : (post?.contentSections || [])
    };

    onPreview(finalSlug, draftPost);
  };

  const sampleMediaPresets = [
    { title: 'Couple Engagement Ring Artwork', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85' },
    { title: 'Personalised Coffee Mugs Artwork', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85' },
    { title: 'Luxury Gift Hamper Box', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85' },
    { title: 'Bespoke Wooden Memory Keepsake', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85' }
  ];

  const paletteColors = ['#000000', '#2271b1', '#db2777', '#10b981', '#f59e0b', '#ef4444', '#64748b', '#475569', '#3b82f6', '#8b5cf6'];

  return (
    <div className="wp-classic-editor-overlay">
      {/* ── 1. TOP WP ADMIN TITLE BAR ──────────────────────────── */}
      <header className="wp-editor-top-bar">
        <div className="wp-top-left">
          <button type="button" className="wp-back-btn" onClick={onClose} title="Return to Blog List">
            <i className="fa-solid fa-arrow-left"></i> All Articles
          </button>
          <h1 className="wp-editor-heading">
            <span className="wp-wordpress-badge">
              <i className="fa-brands fa-wordpress"></i> Classic Editor
            </span>
            {post?.id ? 'Edit Article' : 'Add New Article'}
          </h1>
        </div>

        <div className="wp-top-right">
          <button
            type="button"
            className="wp-btn-secondary"
            onClick={handlePreviewClick}
            title="Preview on storefront"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview
          </button>
          <button
            type="button"
            className="wp-btn-secondary"
            onClick={() => handlePublishOrUpdate('draft')}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="wp-btn-primary"
            onClick={() => handlePublishOrUpdate('published')}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i> {status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </header>

      {/* ── 2. MAIN WORDPRESS 2-COLUMN LAYOUT ─────────────────── */}
      <div className="wp-editor-wrap">
        <div className="wp-editor-layout">
          {/* ── LEFT COLUMN: TITLE & EDITOR ─────────────────────── */}
          <main className="wp-post-body-content">
            {/* Title Wrap */}
            <div className="wp-title-wrap">
              <input
                type="text"
                className="wp-title-input"
                placeholder="Enter title here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            {/* Permalink Slug Bar */}
            <div className="wp-permalink-bar">
              <span className="wp-permalink-prefix">
                <strong>Permalink:</strong> {typeof window !== 'undefined' ? window.location.origin : ''}/blog/
              </span>

              {isEditingSlug ? (
                <>
                  <input
                    type="text"
                    className="wp-permalink-input"
                    value={tempSlug}
                    onChange={(e) => setTempSlug(e.target.value)}
                  />
                  <button
                    type="button"
                    className="wp-permalink-btn"
                    onClick={() => {
                      setSlug(tempSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                      setIsEditingSlug(false);
                    }}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    className="wp-permalink-btn"
                    onClick={() => {
                      setTempSlug(slug);
                      setIsEditingSlug(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="wp-permalink-slug">{slug || 'enter-title-first'}</span>
                  <button
                    type="button"
                    className="wp-permalink-btn"
                    onClick={() => {
                      setTempSlug(slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                      setIsEditingSlug(true);
                    }}
                  >
                    Edit
                  </button>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handlePreviewClick}
                    className="wp-view-post-link"
                    style={{ cursor: 'pointer' }}
                  >
                    View Post <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '10px' }}></i>
                  </span>
                </>
              )}
            </div>

            {/* Media Button & Visual / Text Tabs */}
            <div className="wp-editor-header-bar">
              <button
                type="button"
                className="wp-add-media-btn"
                onClick={() => setIsMediaModalOpen(true)}
              >
                <i className="fa-solid fa-camera"></i>
                <i className="fa-solid fa-music" style={{ fontSize: '10px', marginLeft: '-2px' }}></i>
                Add Media
              </button>

              <div className="wp-editor-tabs">
                <button
                  type="button"
                  className={`wp-tab-btn ${editorMode === 'visual' ? 'active' : ''}`}
                  onClick={() => handleSwitchMode('visual')}
                >
                  Visual
                </button>
                <button
                  type="button"
                  className={`wp-tab-btn ${editorMode === 'text' ? 'active' : ''}`}
                  onClick={() => handleSwitchMode('text')}
                >
                  Text
                </button>
              </div>
            </div>

            {/* TinyMCE / Raw HTML Editor Box */}
            <div className="wp-editor-box">
              {editorMode === 'visual' ? (
                <>
                  {/* TinyMCE Toolbar Row 1 */}
                  <div className="wp-tinymce-toolbar">
                    <div className="wp-toolbar-row">
                      <select
                        className="wp-toolbar-select"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'p') execCmd('formatBlock', '<p>');
                          else if (val.startsWith('h')) execCmd('formatBlock', `<${val}>`);
                          else if (val === 'blockquote') execCmd('formatBlock', '<blockquote>');
                          else if (val === 'pre') execCmd('formatBlock', '<pre>');
                        }}
                        defaultValue="p"
                      >
                        <option value="p">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2 (TOC Section)</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="pre">Preformatted</option>
                        <option value="blockquote">Quote Block</option>
                      </select>

                      <div className="wp-tool-sep"></div>

                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('bold')} title="Bold (Ctrl+B)">
                        <i className="fa-solid fa-bold"></i>
                      </button>
                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('italic')} title="Italic (Ctrl+I)">
                        <i className="fa-solid fa-italic"></i>
                      </button>
                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('insertUnorderedList')} title="Bulleted list">
                        <i className="fa-solid fa-list-ul"></i>
                      </button>
                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('insertOrderedList')} title="Numbered list">
                        <i className="fa-solid fa-list-ol"></i>
                      </button>
                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('formatBlock', '<blockquote>')} title="Blockquote">
                        <i className="fa-solid fa-quote-left"></i>
                      </button>

                      <div className="wp-tool-sep"></div>

                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('justifyLeft')} title="Align left">
                        <i className="fa-solid fa-align-left"></i>
                      </button>
                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('justifyCenter')} title="Align center">
                        <i className="fa-solid fa-align-center"></i>
                      </button>
                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('justifyRight')} title="Align right">
                        <i className="fa-solid fa-align-right"></i>
                      </button>

                      <div className="wp-tool-sep"></div>

                      <button
                        type="button"
                        className="wp-tool-btn"
                        onClick={() => setIsLinkModalOpen(true)}
                        title="Insert/edit link"
                      >
                        <i className="fa-solid fa-link"></i>
                      </button>
                      <button type="button" className="wp-tool-btn" onClick={() => execCmd('unlink')} title="Remove link">
                        <i className="fa-solid fa-unlink"></i>
                      </button>
                      <button
                        type="button"
                        className="wp-tool-btn"
                        onClick={() => execCmd('insertHorizontalRule')}
                        title="Insert Read More tag"
                      >
                        <i className="fa-solid fa-ellipsis"></i>
                      </button>

                      <div className="wp-tool-sep"></div>

                      <button
                        type="button"
                        className={`wp-tool-btn ${showKitchenSink ? 'active' : ''}`}
                        onClick={() => setShowKitchenSink(!showKitchenSink)}
                        title="Toolbar Toggle (Kitchen Sink)"
                      >
                        <i className="fa-solid fa-keyboard"></i>
                      </button>
                    </div>

                    {/* TinyMCE Toolbar Row 2 (Kitchen Sink) */}
                    {showKitchenSink && (
                      <div className="wp-toolbar-row">
                        <button type="button" className="wp-tool-btn" onClick={() => execCmd('strikeThrough')} title="Strikethrough">
                          <i className="fa-solid fa-strikethrough"></i>
                        </button>
                        <button type="button" className="wp-tool-btn" onClick={() => execCmd('insertHorizontalRule')} title="Horizontal line">
                          <i className="fa-solid fa-minus"></i>
                        </button>

                        <div className="wp-color-dropdown">
                          <button
                            type="button"
                            className="wp-tool-btn"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            title="Text color"
                          >
                            <i className="fa-solid fa-font" style={{ color: '#db2777' }}></i>
                            <i className="fa-solid fa-caret-down" style={{ fontSize: '9px', marginLeft: '3px' }}></i>
                          </button>

                          {showColorPicker && (
                            <div className="wp-color-palette-pop">
                              {paletteColors.map((col) => (
                                <div
                                  key={col}
                                  className="wp-palette-swatch"
                                  style={{ background: col }}
                                  onClick={() => {
                                    execCmd('foreColor', col);
                                    setShowColorPicker(false);
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <button type="button" className="wp-tool-btn" onClick={() => execCmd('removeFormat')} title="Clear formatting">
                          <i className="fa-solid fa-eraser"></i>
                        </button>
                        <button type="button" className="wp-tool-btn" onClick={() => execCmd('undo')} title="Undo (Ctrl+Z)">
                          <i className="fa-solid fa-rotate-left"></i>
                        </button>
                        <button type="button" className="wp-tool-btn" onClick={() => execCmd('redo')} title="Redo (Ctrl+Y)">
                          <i className="fa-solid fa-rotate-right"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Visual Contenteditable Canvas */}
                  <div
                    ref={visualEditorRef}
                    className="wp-visual-canvas"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleVisualInput}
                    onBlur={handleVisualInput}
                  />
                </>
              ) : (
                <>
                  {/* Quicktags Toolbar (Text HTML Mode) */}
                  <div className="wp-quicktags-bar">
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<strong>', '</strong>')}>b</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<em>', '</em>')}>i</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => setIsLinkModalOpen(true)}>link</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<blockquote>', '</blockquote>')}>b-quote</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<del>', '</del>')}>del</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<ins>', '</ins>')}>ins</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => setIsMediaModalOpen(true)}>img</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<ul>\n  <li>', '</li>\n</ul>')}>ul</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<ol>\n  <li>', '</li>\n</ol>')}>ol</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<li>', '</li>')}>li</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<h2>', '</h2>')}>h2</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<code>', '</code>')}>code</button>
                    <button type="button" className="wp-quicktag-btn" onClick={() => insertQuicktag('<!--more-->')}>more</button>
                  </div>

                  {/* Textarea for Raw HTML editing */}
                  <textarea
                    ref={textareaRef}
                    className="wp-html-textarea"
                    value={contentHtml}
                    onChange={(e) => setContentHtml(e.target.value)}
                    placeholder="Enter your HTML or text here..."
                  />
                </>
              )}

              {/* Status Bar */}
              <div className="wp-editor-status-bar">
                <span>
                  <strong>Word count:</strong> {wordCount} words
                </span>
                <span>
                  {savedTime ? `Last saved at ${savedTime}` : `Status: ${status === 'published' ? 'Published' : 'Draft'}`}
                </span>
              </div>
            </div>

            {/* Metabox 1: Excerpt */}
            <div className={`wp-postbox ${collapsedBoxes.excerpt ? 'collapsed' : ''}`}>
              <div className="wp-postbox-header" onClick={() => toggleBox('excerpt')}>
                <h3 className="wp-postbox-title">
                  <i className="fa-solid fa-align-left" style={{ color: '#64748b' }}></i> Excerpt
                </h3>
                <span className="wp-postbox-toggle"><i className="fa-solid fa-chevron-down"></i></span>
              </div>
              <div className="wp-postbox-body">
                <textarea
                  rows={3}
                  style={{ width: '100%', padding: '8px', border: '1px solid #dcdcde', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                  placeholder="Excerpts are optional hand-crafted summaries of your content that can be used on listing cards."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Displays on blog card previews and search snippets.
                </span>
              </div>
            </div>

            {/* Metabox 2: Featured Quote / Callout */}
            <div className="wp-postbox">
              <div className="wp-postbox-header">
                <h3 className="wp-postbox-title">
                  <i className="fa-solid fa-quote-left" style={{ color: '#db2777' }}></i> Featured Quote / Callout
                </h3>
              </div>
              <div className="wp-postbox-body">
                <input
                  type="text"
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #dcdcde', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                  placeholder="A thoughtful gift is more than just a present — it's a memory they'll cherish forever."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Renders as an elegant styled pull-quote callout card inside the article.
                </span>
              </div>
            </div>
          </main>

          {/* ── RIGHT COLUMN: SIDEBAR POSTBOXES ─────────────────── */}
          <aside className="wp-sidebar-col">
            {/* Box 1: Publish */}
            <div className={`wp-postbox ${collapsedBoxes.publish ? 'collapsed' : ''}`}>
              <div className="wp-postbox-header" onClick={() => toggleBox('publish')}>
                <h3 className="wp-postbox-title">
                  <i className="fa-solid fa-paper-plane" style={{ color: '#2271b1' }}></i> Publish
                </h3>
                <span className="wp-postbox-toggle"><i className="fa-solid fa-chevron-down"></i></span>
              </div>

              <div className="wp-postbox-body">
                <div className="wp-publish-actions-top">
                  <button
                    type="button"
                    className="wp-btn-secondary"
                    onClick={() => handlePublishOrUpdate('draft')}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    className="wp-btn-secondary"
                    onClick={handlePreviewClick}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    Preview
                  </button>
                </div>

                <div className="wp-misc-pub-sections">
                  {/* Status */}
                  <div className="wp-misc-pub-row">
                    <i className="fa-solid fa-key"></i>
                    <span>
                      Status: <strong>{status === 'published' ? 'Published' : 'Draft'}</strong>
                    </span>
                    <span className="wp-pub-edit-link" onClick={() => setIsEditingStatus(!isEditingStatus)}>
                      {isEditingStatus ? 'Done' : 'Edit'}
                    </span>
                  </div>
                  {isEditingStatus && (
                    <div style={{ padding: '6px 0 6px 22px' }}>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #c3c4c7', borderRadius: '3px' }}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  )}

                  {/* Visibility */}
                  <div className="wp-misc-pub-row">
                    <i className="fa-solid fa-eye"></i>
                    <span>Visibility: <strong>Public</strong></span>
                  </div>

                  {/* Revisions */}
                  <div className="wp-misc-pub-row">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span>Revisions: <strong>1</strong></span>
                  </div>

                  {/* Publish Date */}
                  <div className="wp-misc-pub-row">
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>Published on: <strong>{publishedAt}</strong></span>
                    <span className="wp-pub-edit-link" onClick={() => setIsEditingDate(!isEditingDate)}>
                      {isEditingDate ? 'Done' : 'Edit'}
                    </span>
                  </div>
                  {isEditingDate && (
                    <div style={{ padding: '6px 0 6px 22px' }}>
                      <input
                        type="text"
                        value={publishedAt}
                        onChange={(e) => setPublishedAt(e.target.value)}
                        placeholder="Oct 18, 2026"
                        style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #c3c4c7', borderRadius: '3px', width: '130px' }}
                      />
                    </div>
                  )}
                </div>

                <div className="wp-publish-actions-bottom">
                  <span
                    className="wp-trash-link"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this article?')) {
                        onClose();
                      }
                    }}
                  >
                    Move to Trash
                  </span>
                  <button
                    type="button"
                    className="wp-btn-primary"
                    onClick={() => handlePublishOrUpdate()}
                  >
                    {status === 'published' ? 'Update' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>

            {/* Box 2: Categories */}
            <div className={`wp-postbox ${collapsedBoxes.categories ? 'collapsed' : ''}`}>
              <div className="wp-postbox-header" onClick={() => toggleBox('categories')}>
                <h3 className="wp-postbox-title">
                  <i className="fa-solid fa-folder-open" style={{ color: '#f59e0b' }}></i> Categories
                </h3>
                <span className="wp-postbox-toggle"><i className="fa-solid fa-chevron-down"></i></span>
              </div>

              <div className="wp-postbox-body">
                <div className="wp-cat-tabs">
                  <button type="button" className="wp-cat-tab-btn active">All Categories</button>
                </div>

                <div className="wp-cat-list">
                  {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((catItem) => (
                    <label key={catItem.id} className="wp-cat-label">
                      <input
                        type="radio"
                        name="blog_category"
                        className="wp-cat-checkbox"
                        checked={categorySlug === catItem.id || category === catItem.label}
                        onChange={() => {
                          setCategory(catItem.label);
                          setCategorySlug(catItem.id);
                        }}
                      />
                      <span>{catItem.label}</span>
                    </label>
                  ))}
                  {/* Additional popular wedding & birthday tags */}
                  <label className="wp-cat-label">
                    <input
                      type="radio"
                      name="blog_category"
                      className="wp-cat-checkbox"
                      checked={category === 'Engagement'}
                      onChange={() => {
                        setCategory('Engagement');
                        setCategorySlug('occasions');
                      }}
                    />
                    <span>Engagement</span>
                  </label>
                </div>

                <span
                  className="wp-add-cat-toggle"
                  onClick={() => setShowNewCatInput(!showNewCatInput)}
                >
                  + Add New Category
                </span>

                {showNewCatInput && (
                  <div className="wp-inline-add-cat">
                    <input
                      type="text"
                      placeholder="Category name"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #c3c4c7', borderRadius: '3px', flex: 1 }}
                    />
                    <button
                      type="button"
                      className="wp-btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                      onClick={() => {
                        if (!newCatName.trim()) return;
                        setCategory(newCatName.trim());
                        setCategorySlug(newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        setNewCatName('');
                        setShowNewCatInput(false);
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Box 3: Featured Image */}
            <div className={`wp-postbox ${collapsedBoxes.featuredImage ? 'collapsed' : ''}`}>
              <div className="wp-postbox-header" onClick={() => toggleBox('featuredImage')}>
                <h3 className="wp-postbox-title">
                  <i className="fa-solid fa-image" style={{ color: '#10b981' }}></i> Featured Image
                </h3>
                <span className="wp-postbox-toggle"><i className="fa-solid fa-chevron-down"></i></span>
              </div>

              <div className="wp-postbox-body">
                {featuredImage ? (
                  <>
                    <img
                      src={featuredImage}
                      alt="Featured Preview"
                      className="wp-featured-img-preview"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85'; }}
                    />
                    <input
                      type="text"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      style={{ width: '100%', padding: '4px 8px', fontSize: '11px', border: '1px solid #dcdcde', borderRadius: '3px', boxSizing: 'border-box', marginBottom: '8px' }}
                      placeholder="Image URL"
                    />
                    <span className="wp-feat-remove-link" onClick={() => setFeaturedImage('')}>
                      Remove featured image
                    </span>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Paste image URL here..."
                      style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #c3c4c7', borderRadius: '3px', boxSizing: 'border-box', marginBottom: '8px' }}
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                    />
                    <button
                      type="button"
                      className="wp-feat-link-btn"
                      onClick={() => setFeaturedImage('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85')}
                    >
                      Set default studio engagement image
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Box 4: Article Options (Trending & Reading Time) */}
            <div className={`wp-postbox ${collapsedBoxes.articleOptions ? 'collapsed' : ''}`}>
              <div className="wp-postbox-header" onClick={() => toggleBox('articleOptions')}>
                <h3 className="wp-postbox-title">
                  <i className="fa-solid fa-sliders" style={{ color: '#6366f1' }}></i> Article Options
                </h3>
                <span className="wp-postbox-toggle"><i className="fa-solid fa-chevron-down"></i></span>
              </div>

              <div className="wp-postbox-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    style={{ accentColor: '#2271b1' }}
                  />
                  <span>Mark as Trending Article (Top 5)</span>
                </label>

                {trending && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span>Trending Rank:</span>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={trendingRank}
                      onChange={(e) => setTrendingRank(e.target.value)}
                      style={{ width: '50px', padding: '3px 6px', border: '1px solid #c3c4c7', borderRadius: '3px' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#50575e' }}>Reading Time Estimate:</span>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min read"
                    style={{ width: '100%', padding: '4px 8px', fontSize: '12px', border: '1px solid #c3c4c7', borderRadius: '3px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── 3. INSERT MEDIA MODAL ─────────────────────────────── */}
      {isMediaModalOpen && (
        <div className="wp-modal-backdrop" onClick={() => setIsMediaModalOpen(false)}>
          <div className="wp-media-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wp-media-modal-header">
              <h3 className="wp-media-modal-title">
                <i className="fa-solid fa-photo-film" style={{ color: '#2271b1', marginRight: '8px' }}></i>
                Insert Media
              </h3>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#8c8f94', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="wp-media-modal-body">
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #dcdcde', paddingBottom: '8px' }}>
                <button
                  type="button"
                  className={`wp-btn-secondary ${mediaTab === 'url' ? 'active' : ''}`}
                  onClick={() => setMediaTab('url')}
                  style={{ fontSize: '12px' }}
                >
                  Insert from URL
                </button>
                <button
                  type="button"
                  className={`wp-btn-secondary ${mediaTab === 'presets' ? 'active' : ''}`}
                  onClick={() => setMediaTab('presets')}
                  style={{ fontSize: '12px' }}
                >
                  Sample Gift Studio Images
                </button>
              </div>

              {mediaTab === 'presets' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                  {sampleMediaPresets.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setMediaUrl(item.url);
                        setMediaAlt(item.title);
                        setMediaTab('url');
                      }}
                      style={{
                        border: mediaUrl === item.url ? '2px solid #2271b1' : '1px solid #dcdcde',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#f8fafc'
                      }}
                    >
                      <img src={item.url} alt={item.title} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                      <div style={{ padding: '6px', fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Image URL *</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #c3c4c7', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Alt Text (Accessibility &amp; SEO)</label>
                    <input
                      type="text"
                      placeholder="Describe the image..."
                      value={mediaAlt}
                      onChange={(e) => setMediaAlt(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #c3c4c7', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Alignment</label>
                      <select
                        value={mediaAlign}
                        onChange={(e) => setMediaAlign(e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #c3c4c7', borderRadius: '4px', boxSizing: 'border-box' }}
                      >
                        <option value="none">None</option>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Caption</label>
                      <input
                        type="text"
                        placeholder="Optional caption..."
                        value={mediaCaption}
                        onChange={(e) => setMediaCaption(e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #c3c4c7', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="wp-media-modal-footer">
              <button type="button" className="wp-btn-secondary" onClick={() => setIsMediaModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="wp-btn-primary"
                disabled={!mediaUrl.trim()}
                onClick={handleInsertMedia}
              >
                Insert into post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. INSERT LINK MODAL ──────────────────────────────── */}
      {isLinkModalOpen && (
        <div className="wp-modal-backdrop" onClick={() => setIsLinkModalOpen(false)}>
          <div className="wp-media-modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="wp-media-modal-header">
              <h3 className="wp-media-modal-title">
                <i className="fa-solid fa-link" style={{ color: '#2271b1', marginRight: '8px' }}></i>
                Insert/edit Link
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#8c8f94', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="wp-media-modal-body">
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>URL *</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #c3c4c7', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Link Text</label>
                <input
                  type="text"
                  placeholder="e.g. view our engagement collection"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #c3c4c7', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  style={{ accentColor: '#2271b1' }}
                />
                <span>Open link in a new tab</span>
              </label>
            </div>

            <div className="wp-media-modal-footer">
              <button type="button" className="wp-btn-secondary" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="wp-btn-primary"
                disabled={!linkUrl.trim()}
                onClick={handleInsertLink}
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
