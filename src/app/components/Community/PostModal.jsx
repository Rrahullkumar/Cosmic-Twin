// PostModal.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const PostModal = ({ isOpen, onClose }) => {
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Fetch current user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData.user || userData); // Handle different response formats
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (isOpen) {
            fetchUser();
        }
    }, [isOpen]);

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview('');
    };

    // Get user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await fetch('/api/posts/create', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setContent('');
                setSelectedImage(null);
                setImagePreview('');
                onClose();
                // Refresh the page to show new post
                window.location.reload();
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
                style={{ background: 'var(--off-white)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--dark-text)]">Create New Post</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-[var(--subtle-text)] hover:text-[var(--dark-text)] transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: 'var(--muted-pink)' }}
                    >
                        {user ? getUserInitials(user.name || user.username) : 'U'}
                    </div>
                    <span className="font-medium text-[var(--dark-text)]">
                        {user?.name || user?.username || 'User'}
                    </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Content Input */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your cosmic mind? Share your thoughts and reflections..."
                        className="w-full p-4 border-none outline-none resize-none rounded-xl text-[var(--dark-text)] placeholder:text-[var(--subtle-text)] min-h-[120px]"
                        style={{ background: 'var(--warm-lilac-gray)' }}
                        required
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mt-4 relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-h-80 object-cover rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6">
                        {/* Image Upload */}
                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-[var(--warm-lilac-gray)]">
                            <span className="text-xl">📸</span>
                            <span className="text-sm text-[var(--subtle-text)]">Add Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !content.trim()}
                            className="px-6 py-2 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: content.trim()
                                    ? 'linear-gradient(to right, var(--muted-pink), var(--lavender-purple))'
                                    : 'var(--warm-lilac-gray)'
                            }}
                        >
                            {isLoading ? 'Posting...' : 'Share Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostModal;
