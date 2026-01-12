import React from 'react';

interface FiltersBarProps {
    searchText: string;
    onSearchChange: (text: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
    searchText,
    onSearchChange,
    onClearFilters,
    hasActiveFilters
}) => {
    return (
        <div className="filters-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#fafafa'
        }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search in table..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                    aria-label="Search table"
                />
            </div>
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px',
                        whiteSpace: 'nowrap'
                    }}
                    aria-label="Clear all filters"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};
