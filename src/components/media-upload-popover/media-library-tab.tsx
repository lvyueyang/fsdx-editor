import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditorOptions } from '../../core/editor-context';
import { cn } from '../../core/tiptap-utils';
import { formatFileSize } from '../../lib/format-file-size';
import type { MediaItem, MediaType } from '../../types';

interface MediaLibraryTabProps {
  mediaType: MediaType;
  onInsert: (url: string, extraAttrs?: Record<string, unknown>) => void;
}

const PAGE_SIZE = 12;

export function MediaLibraryTab({ mediaType, onInsert }: MediaLibraryTabProps) {
  const options = useEditorOptions();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const listConfig = options?.[mediaType];

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchList = useCallback(
    (p: number, kw: string) => {
      if (!listConfig) return;
      setLoading(true);
      listConfig
        .getList({ page: p, pageSize: PAGE_SIZE, keyword: kw || undefined })
        .then((result) => {
          setItems(result.items);
          setTotal(result.total);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [listConfig],
  );

  useEffect(() => {
    fetchList(1, '');
  }, [fetchList]);

  const handleSearch = useCallback(
    (value: string) => {
      setKeyword(value);
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      searchTimerRef.current = setTimeout(() => {
        setPage(1);
        fetchList(1, value);
      }, 300);
    },
    [fetchList],
  );

  const keywordRef = useRef(keyword);
  keywordRef.current = keyword;

  const goToPage = useCallback(
    (p: number) => {
      setPage(p);
      fetchList(p, keywordRef.current);
    },
    [fetchList],
  );

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSelect = useCallback(
    (item: MediaItem) => {
      const extraAttrs: Record<string, unknown> = {
        fileName: item.name,
      };
      if (mediaType === 'attachment') {
        extraAttrs.fileSize = item.size;
        extraAttrs.fileType = item.fileType || '';
      }
      onInsert(item.url, extraAttrs);
    },
    [mediaType, onInsert],
  );

  if (!listConfig) {
    return (
      <div className="tiptap-media-upload-placeholder">
        未配置 {mediaType} 素材库
      </div>
    );
  }

  const isGrid = mediaType === 'image' || mediaType === 'video';

  return (
    <div className="tiptap-media-library-tab">
      <div className="tiptap-media-library-search">
        <input
          type="text"
          className="tiptap-media-library-search-input"
          placeholder="搜索..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="tiptap-media-library-loading">加载中...</div>
      ) : items.length === 0 ? (
        <div className="tiptap-media-library-empty">暂无内容</div>
      ) : (
        <div
          className={cn('tiptap-media-library-list', {
            'tiptap-media-library-list--grid': isGrid,
            'tiptap-media-library-list--list': !isGrid,
          })}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="tiptap-media-library-item"
              onClick={() => handleSelect(item)}
            >
              {isGrid && item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="tiptap-media-library-thumb"
                />
              ) : (
                <div className="tiptap-media-library-icon-placeholder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    {mediaType === 'video' && (
                      <polygon points="5 3 19 12 5 21 5 3" />
                    )}
                    {mediaType === 'audio' && (
                      <>
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                      </>
                    )}
                    {mediaType === 'attachment' && (
                      <>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </>
                    )}
                  </svg>
                </div>
              )}
              <span className="tiptap-media-library-item-name">
                {item.name}
              </span>
              {item.size !== undefined && (
                <span className="tiptap-media-library-item-size">
                  {formatFileSize(item.size)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="tiptap-media-library-pagination">
          <button
            type="button"
            className="tiptap-media-library-page-btn"
            disabled={page <= 1 || loading}
            onClick={() => goToPage(Math.max(1, page - 1))}
          >
            上一页
          </button>
          <span className="tiptap-media-library-page-info">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="tiptap-media-library-page-btn"
            disabled={page >= totalPages || loading}
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
