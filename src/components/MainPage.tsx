import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createFile, listFiles } from '../services/googleApi';
import LetterEditor from './LetterEditor';

const MainPage: React.FC = () => {
    const { isSignedIn, signIn, signOut } = useContext(AuthContext);
    const [files, setFiles] = useState<gapi.client.drive.File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [draft, setDraft] = useState<string>(() => localStorage.getItem('letterDraft') || '');

    useEffect(() => {
        if (isSignedIn) {
            fetchFiles();
        } else {
            setFiles([]);
        }
    }, [isSignedIn]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const apiFiles = await listFiles();
            setFiles(apiFiles.filter((file) => file.id));
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFile = async (content: string) => {
        try {
            const fileName = `Letter_${new Date().toISOString()}.txt`;
            await createFile(fileName, content);
            setDraft(''); // Clear draft after upload
            localStorage.removeItem('letterDraft'); // Remove from storage
            fetchFiles();
        } catch (error) {
            console.error('Error uploading letter:', error);
        }
    };

    return (
        <section>
            {isSignedIn ? (
                <section>
                    <div className="mb-4">
                        <button className="btn btn-lg bg-danger" onClick={signOut}>Sign Out</button>
                    </div>

                    <LetterEditor
                        initialContent={draft}
                        onSaveDraft={(content) => {
                            setDraft(content);
                            localStorage.setItem('letterDraft', content); // Persist draft
                        }}
                        onUpload={handleCreateFile}
                    />

                    <div>
                        <h5>Your Files</h5>
                        {loading ? (
                            <div className="alert alert-primary">Loading files...</div>
                        ) : files.length > 0 ? (
                            <ul>
                                {files.map((file) => (
                                    <li key={file.id!}>
                                        {file.name} ({file.mimeType || 'Unknown Type'})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="alert alert-warning">No files found.</div>
                        )}
                    </div>
                </section>
            ) : (
                <button className="btn btn-lg bg-success" onClick={signIn}>
                    Sign In with Google
                </button>
            )}
        </section>
    );
};

export default MainPage;
