import { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) {
        return (
            <div className="gallery-empty">
                <div className="empty-icon">🖼️</div>
                <h3>No Images Available</h3>
                <p>Images are being generated or not available for this subtopic.</p>
            </div>
        );
    }

    const imageData = parseImages(images);

    if (imageData.length === 0) {
        return (
            <div className="gallery-empty">
                <div className="empty-icon">🖼️</div>
                <h3>No Images Available</h3>
                <p>Could not parse image data.</p>
            </div>
        );
    }

    return (
        <div className="image-gallery">
            <div className="gallery-header">
                <h3 className="gallery-title">Visual Resources</h3>
                <span className="gallery-count">{imageData.length} image{imageData.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="gallery-grid">
                {imageData.map((image, index) => (
                    <div
                        key={index}
                        className="gallery-item"
                        onClick={() => setSelectedImage(image)}
                    >
                        <div className="image-wrapper">
                            <img
                                src={image.url}
                                alt={image.title || `Image ${index + 1}`}
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231a1a25" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%2364748b" font-size="12">Image unavailable</text></svg>';
                                }}
                            />
                            <div className="image-overlay">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M11 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        {image.title && (
                            <span className="image-caption">{image.title}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title || 'Selected image'}
                            className="lightbox-image"
                        />
                        {selectedImage.title && (
                            <div className="lightbox-caption">
                                <h4>{selectedImage.title}</h4>
                                {selectedImage.description && <p>{selectedImage.description}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Parse images from various formats
const parseImages = (images) => {
    if (Array.isArray(images)) {
        return images.map((img, index) => {
            if (typeof img === 'string') {
                return { url: img, title: `Image ${index + 1}` };
            }
            return {
                url: img.url || img.src || img.image || '',
                title: img.title || img.caption || img.alt || '',
                description: img.description || ''
            };
        }).filter(img => img.url);
    }

    if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) {
                return parseImages(parsed);
            }
            // Single image object
            if (parsed.url || parsed.src) {
                return [{
                    url: parsed.url || parsed.src,
                    title: parsed.title || 'Image',
                    description: parsed.description || ''
                }];
            }
        } catch {
            // Treat as single URL
            return [{ url: images, title: 'Image' }];
        }
    }

    return [];
};

export default ImageGallery;
