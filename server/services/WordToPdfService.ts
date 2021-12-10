import axios, { AxiosResponse } from 'axios';
import { Readable, Stream } from 'stream';
import FormData from 'form-data';
import path from 'path';
import { dev, WORD_TO_PDF_URI } from '../config';

interface UploadModelOptions {
  contentType: string;
  filename: string;
}

interface UploadModelResponse {
  status: 'success' | 'error';
  originalFilename: string;
  pdfFilename: string;
}

class WordToPdfService {
  private getReadable(buffer: Buffer) {
    let readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  isSupport(filename: string): boolean {
    let ext = path.extname(filename).toLowerCase();
    return [
      '.dwf',
      '.dwg',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.doc',
      '.docx',
    ].includes(ext);
  }

  async transferToPdf(
    buffer: Buffer,
    filename: string
  ): Promise<AxiosResponse<Stream>> {
    if (!this.isSupport(filename)) {
      throw new Error(`文件类型不支持: ${filename}`);
    }

    let readable = this.getReadable(buffer);
    let domain = WORD_TO_PDF_URI || `http://rlg-word-to-pdf`;
    if (dev) {
      domain = WORD_TO_PDF_URI || `http://localhost:28080`;
    }

    let ext = path.extname(filename).toLowerCase();

    let transferUrl = `/api/v2/wordtopdf`;
    let contentType = `application/vnd.openxmlformats-officedocument.wordprocessingml.document`;

    switch (ext) {
      case '.dwf':
      case '.dxf':
      case '.dwg': {
        contentType = 'application/acad';
        transferUrl = '/api/v2/dwg2pdf';
        break;
      }

      case '.xls': {
        contentType = 'application/vnd.ms-excel';
        transferUrl = `/api/v2/sheet2pdf`;
        break;
      }
      case '.xlsx': {
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        transferUrl = `/api/v2/sheet2pdf`;
        break;
      }

      case '.ppt': {
        contentType = 'application/vnd.ms-powerpoint';
        transferUrl = `/api/v2/ppt2pdf`;
        break;
      }
      case '.pptx': {
        contentType =
          'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        transferUrl = `/api/v2/ppt2pdf`;
        break;
      }

      case '.doc': {
        contentType = 'application/msword';
        break;
      }
      case '.docx': {
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      }
      default:
        break;
    }

    const formData = new FormData();
    formData.append('file', readable, {
      contentType,
      filename,
    });
    const pdf = await axios.post(`${domain}${transferUrl}`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: 'stream',
      maxContentLength: Infinity,
    });
    return pdf;
  }

  async transferStreamToPdf(
    data: any,
    filename: string
  ): Promise<AxiosResponse<Stream>> {
    if (!this.isSupport(filename)) {
      throw new Error(`文件类型不支持: ${filename}`);
    }

    let domain = WORD_TO_PDF_URI || `http://rlg-word-to-pdf`;
    if (dev) {
      domain = WORD_TO_PDF_URI || `http://localhost:28080`;
    }

    let ext = path.extname(filename).toLowerCase();

    let transferUrl = `/api/v2/wordtopdf`;
    let contentType = `application/vnd.openxmlformats-officedocument.wordprocessingml.document`;

    switch (ext) {
      case '.dwf':
      case '.dxf':
      case '.dwg': {
        contentType = 'application/acad';
        transferUrl = '/api/v2/dwg2pdf';
        break;
      }

      case '.xls': {
        contentType = 'application/vnd.ms-excel';
        transferUrl = `/api/v2/sheet2pdf`;
        break;
      }
      case '.xlsx': {
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        transferUrl = `/api/v2/sheet2pdf`;
        break;
      }

      case '.ppt': {
        contentType = 'application/vnd.ms-powerpoint';
        transferUrl = `/api/v2/ppt2pdf`;
        break;
      }
      case '.pptx': {
        contentType =
          'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        transferUrl = `/api/v2/ppt2pdf`;
        break;
      }

      case '.doc': {
        contentType = 'application/msword';
        break;
      }
      case '.docx': {
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      }
      default:
        break;
    }

    const formData = new FormData();
    formData.append('file', data, {
      contentType,
      filename,
    });
    const pdf = await axios.post(`${domain}${transferUrl}`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: 'stream',
      maxContentLength: Infinity,
    });
    return pdf;
  }

  async transferWordToPdf(
    buffer: Buffer,
    filename: string
  ): Promise<AxiosResponse<Stream>> {
    return this.transferToPdf(buffer, filename);
  }
}

const wordToPdfService = new WordToPdfService();
export default wordToPdfService;
