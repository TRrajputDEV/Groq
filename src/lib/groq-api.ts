export async function queryGroqAI({ message, reportContent }: { message: string; reportContent?: string }) {
    try {
        console.log('Sending request to /api/groq endpoint...');
        const res = await fetch('/api/groq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, reportContent }),
            cache: 'no-store'
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error('API response error:', res.status, errorData);
            throw new Error(`Failed to fetch from Groq API: ${res.status} ${errorData.error || ''}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in queryGroqAI:', error);
        throw error;
    }
}

export async function extractTextFromDocument(file: File): Promise<string> {
    try {
        // Handle different file types
        if (file.type.includes('pdf')) {
            // For PDFs, we'll load the PDF.js library dynamically
            const text = await extractPdfText(file);
            return text;
        } else if (file.type.includes('image')) {
            return "This appears to be an image file. I can see it was uploaded, but I can't extract text from images without OCR capabilities. I'll provide general medical advice based on your questions instead.";
        } else if (file.type.includes('word') || file.type.includes('docx')) {
            return await extractDocxText(file);
        } else {
            // For plain text files
            return await file.text();
        }
    } catch (error) {
        console.error('Error extracting text:', error);
        return `I had trouble reading this file format. Please try uploading a plain text, PDF, or Word document file instead.`;
    }
}

async function extractPdfText(file: File): Promise<string> {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return "PDF processing is only available in browser environments.";
        }

        // Dynamically import PDF.js
        const pdfjsLib = await import('pdfjs-dist');
        
        // Configure the worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        // Convert the file to an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = "";
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + "\n";
        }
        
        return fullText || "The PDF appears to be empty or contains no extractable text.";
    } catch (error) {
        console.error("Error reading PDF:", error);
        return "I encountered an issue reading this PDF. It might be encrypted, damaged, or in an unsupported format.";
    }
}

async function extractDocxText(file: File): Promise<string> {
    try {
        // Use mammoth.js for DOCX extraction
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || "The document appears to be empty or contains no extractable text.";
    } catch (error) {
        console.error("Error reading DOCX:", error);
        return "I encountered an issue reading this Word document. It might be in an unsupported format.";
    }
}