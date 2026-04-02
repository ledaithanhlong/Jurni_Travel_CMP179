import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Edit2, X, Check } from 'lucide-react';
import axios from 'axios';

const EditableImage = ({
    src,
    alt,
    className,
    apiEndpoint,
    id,
    onUpdate,
    hasSizeOption = false,
    currentSize = 'normal'
}) => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [url, setUrl] = useState(src || '');
    const [size, setSize] = useState(currentSize);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!apiEndpoint || !id) return;
        setSaving(true);
        try {
            // Prepare payload based on available options
            const payload = {
                [hasSizeOption === 'style' ? 'image_url' : 'url']: url,
                // Add other fields logic
            };

            // Specific logic for different models could be handled better, 
            // but here we simplify: 
            // Gallery uses 'url' and 'col_span'/'row_span' mapped from size
            // Value uses 'image_url' and 'image_style'

            if (hasSizeOption === 'gallery') {
                // Map simple size to spans for gallery
                const spanMap = {
                    'small': { col_span: 1, row_span: 1 },
                    'medium': { col_span: 2, row_span: 1 },
                    'large': { col_span: 2, row_span: 2 },
                };
                Object.assign(payload, spanMap[size] || spanMap['small']);
            } else if (hasSizeOption === 'style') {
                payload.image_url = url;
                // For values, we might just store simple style
                payload.image_style = { size };
            } else if (hasSizeOption === 'avatar') {
                payload.avatar_url = url;
            }

            // Hack: adjust payload key for simple 'url' vs 'image_url' based on common patterns if needed
            // But let's rely on prop 'apiEndpoint' to be correct resource
            // And assume 'url' or 'image_url' is handled by the caller or we send both valid keys?
            // Better: Allow updating specific keys via props. 
            // Refactoring: Let's just send what changed.

            const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.put(`${API}/${apiEndpoint}/${id}`, payload);

            setIsEditing(false);
            if (onUpdate) onUpdate(); // Refresh parent
        } catch (e) {
            console.error(e);
            alert('Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`relative group ${className}`}>
            <img src={src || 'https://via.placeholder.com/400'} alt={alt} className="w-full h-full object-cover" />

            {isAdmin && !isEditing && (
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); setUrl(src); }}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-gray-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-orange-500 hover:text-white"
                    title="Edit Image"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            )}

            {isEditing && (
                <div className="absolute inset-0 bg-white/95 z-30 p-4 flex flex-col gap-3 justify-center items-center text-sm shadow-xl rounded-xl border border-blue-100" onClick={(e) => e.stopPropagation()}>
                    <h4 className="font-bold text-gray-700">Edit Image</h4>
                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Image URL..."
                        className="w-full border rounded px-2 py-1"
                    />

                    {hasSizeOption === 'gallery' && (
                        <div className="flex gap-2">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => setSize(s)} className={`px-2 py-1 rounded border capitalize ${size === s ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2 mt-2">
                        <button onClick={() => setIsEditing(false)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><X className="w-4 h-4" /></button>
                        <button onClick={handleSave} disabled={saving} className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
                            {saving ? '...' : <Check className="w-4 h-4" />}
                        </button>
                    </div>
                    <button
                        onClick={async () => {
                            if (!confirm("Are you sure?")) return;
                            // Delete logic can go here or be simpler
                        }}
                        className="text-xs text-red-500 underline mt-1"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditableImage;
