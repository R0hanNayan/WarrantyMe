import React, { useState, useEffect } from 'react';

interface LetterEditorProps {
    initialContent: string;
    onSaveDraft: (content: string) => void;
    onUpload: (content: string) => void;
}

const LetterEditor: React.FC<LetterEditorProps> = ({ initialContent, onSaveDraft, onUpload }) => {
    const [content, setContent] = useState(initialContent);

    // Load initial content when the component mounts or initialContent changes
    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = event.target.value;
        setContent(newContent);
        onSaveDraft(newContent); // Save draft when user types
    };

    return (
        <div>
            <h3>Write Your Letter</h3>
            <textarea
                value={content}
                onChange={handleChange}
                rows={10}
                cols={50}
                placeholder="Start writing your letter..."
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
            <div style={{ marginTop: '10px' }}>
                <button
                    className="btn btn-primary me-2"
                    onClick={() => onUpload(content)}
                    disabled={!content.trim()} // Disable upload if content is empty
                >
                    Upload to Google Drive
                </button>
            </div>
        </div>
    );
};

export default LetterEditor;
