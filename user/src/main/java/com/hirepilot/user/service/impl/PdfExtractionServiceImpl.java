package com.hirepilot.user.service.impl;

import com.hirepilot.user.exception.OpenAIProcessingException;
import com.hirepilot.user.service.PdfExtractionService;
import org.apache.pdfbox.Loader;              // <-- NEW in PDFBox 3.x
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class PdfExtractionServiceImpl implements PdfExtractionService {

    private static final Logger log = LoggerFactory.getLogger(PdfExtractionServiceImpl.class);

    @Override
    public String extractText(String filePath) {
        log.debug("Extracting text from PDF: {}", filePath);
        File file = new File(filePath);

        if (!file.exists() || !file.isFile()) {
            throw new OpenAIProcessingException("PDF file not found at path: " + filePath);
        }

        try (PDDocument document = Loader.loadPDF(file)) {  // <-- Loader.loadPDF, not PDDocument.load
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.debug("Extracted {} characters from PDF", text.length());
            return text;
        } catch (IOException e) {
            throw new OpenAIProcessingException("Failed to extract text from PDF", e);
        }
    }
}