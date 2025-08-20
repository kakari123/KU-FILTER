
import React, { useState, useEffect, useCallback } from 'react';
import { FILTER_MAP } from './constants/filterMap';
import { CopyIcon, ClearIcon } from './components/Icons';

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [filteredText, setFilteredText] = useState<string>('');
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const filterWords = useCallback((text: string): string => {
        // Sort keys by length descending to replace longer words first (e.g., "هاککردن" before "هاك")
        const sortedKeys = Object.keys(FILTER_MAP).sort((a, b) => b.length - a.length);

        let processedText = text;
        for (const word of sortedKeys) {
            // Using split and join as a cross-browser compatible replacement for replaceAll.
            processedText = processedText.split(word).join(FILTER_MAP[word]);
        }
        return processedText;
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputText) {
                const newFilteredText = filterWords(inputText);
                setFilteredText(newFilteredText);
            } else {
                setFilteredText('');
            }
        }, 200); // Debounce input to avoid excessive re-renders on fast typing

        return () => {
            clearTimeout(handler);
        };
    }, [inputText, filterWords]);

    const handleCopy = () => {
        if (filteredText) {
            navigator.clipboard.writeText(filteredText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleClear = () => {
        setInputText('');
        setFilteredText('');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
            <header className="w-full max-w-6xl text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                   یەکەمین فلتەر کەری کووردی
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                    دەستبەجێ ئەو وشانەی دیاریکراون لە دەقەکەتدا بە شێوازێکی تایبەت فلتەر بکە.
                </p>
            </header>

            <main className="w-full max-w-6xl flex-grow flex flex-col lg:flex-row gap-6">
                {/* Input Section */}
                <div className="w-full lg:w-1/2 flex flex-col bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-200">دەقی سەرەکی</h2>
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-red-800/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                        >
                            <ClearIcon />
                            سڕینەوە
                        </button>
                    </div>
                    <div className="flex-grow p-1">
                         <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="...لێرە دەقەکەت بنووسە"
                            dir="rtl"
                            className="w-full h-full min-h-[300px] bg-transparent text-gray-200 p-3 resize-none focus:outline-none text-lg leading-relaxed"
                         />
                    </div>
                </div>

                {/* Output Section */}
                <div className="w-full lg:w-1/2 flex flex-col bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-200">دەقی فلتەرکراو</h2>
                        <button
                            onClick={handleCopy}
                            disabled={!filteredText}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                        >
                            <CopyIcon />
                            {isCopied ? 'کۆپیکرا!' : 'کۆپیکردن'}
                        </button>
                    </div>
                    <div className="flex-grow p-4">
                        <pre className="w-full h-full min-h-[300px] bg-transparent text-gray-300 whitespace-pre-wrap break-words text-lg leading-relaxed" dir="rtl">
                            {filteredText || <span className="text-gray-500">...ئەنجامی فلتەرکراو لێرە دەردەکەوێت</span>}
                        </pre>
                    </div>
                </div>
            </main>

            <footer className="w-full max-w-6xl text-center mt-8 text-gray-500 text-sm">
                <p>دیزاین کراوە بۆ فلتەرکردنی دەق بە شێوەیەکی جوان و کارا.</p>
            </footer>
        </div>
    );
};

export default App;