import multer from 'multer';
import Storage from 'multer-gridfs-storage';
import {
  GridFSBucket,
  MongoClient,
  ObjectId,
  GridFSBucketReadStream,
  Db,
} from 'mongodb';
import { Response } from 'express';

import { CONFIG_MONGO } from '../config';
import { Readable } from 'stream';
import path from 'path';

const { host, database, port } = CONFIG_MONGO;

interface Options {
  read?: {
    start: number;
    end: number;
  };
  sharp?: {
    op?: 'resize';
    width?: number;
    height?: number;
  };
}

class MongodbGridfsService {
  db: Db;
  storage: Storage;
  gridfsBucket: GridFSBucket;
  bucketName = 'gridfs';

  async connect() {
    const url: string = this.getConnectionURL();
    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    let connection = await MongoClient.connect(url, connectOptions);
    this.db = connection.db(database);
    this.gridfsBucket = new GridFSBucket(this.db, {
      bucketName: this.bucketName,
    });
    this.getMulterStorage();
    return connection;
  }

  getConnectionURL(): string {
    return `mongodb://${host}:${port}/${database}`;
  }

  getMulterStorage() {
    if (!this.storage) {
      const url = this.getConnectionURL();
      this.storage = new Storage({
        url,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        file: (req, file) => {
          return {
            filename: file.originalname,
            bucketName: this.bucketName,
          };
        },
      });
    }
    return multer({ storage: this.storage });
  }

  async read(
    _id: string,
    options: Options
  ): Promise<{
    stream: GridFSBucketReadStream;
    file: any;
  }> {
    const cursor = this.gridfsBucket.find({ _id: new ObjectId(_id) });
    const files = await cursor.toArray();
    const file = files[0];

    if (!file) {
      throw new Error('文件不存在');
    }

    const stream = this.gridfsBucket.openDownloadStream(
      new ObjectId(_id),
      options.read
    );
    return { stream, file };
  }

  async download(
    _id: string,
    res: Response,
    options: {
      read?: {
        start: number;
        end: number;
      };
      sharp?: {
        op?: 'resize';
        width?: number;
        height?: number;
      };
    }
  ) {
    const { stream, file } = await this.read(_id, options);
    res.setHeader('Content-Type', file.contentType);

    let ext = path.extname(file.filename).toLowerCase();
    if (!'.pdf'.includes(ext)) {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + encodeURIComponent(file.filename)
      );
    }

    stream.pipe(res);
  }

  async getFileInfo(_id: string) {
    const cursor = this.gridfsBucket.find({ _id: new ObjectId(_id) });
    const files = await cursor.toArray();
    const file = files[0];
    return file;
  }

  async getFilesInfo(_ids: string[]) {
    if (_ids.length === 0) {
      return [];
    }

    const cursor = this.gridfsBucket.find({
      _id: { $in: _ids.map((_id) => new ObjectId(_id)) },
    });
    const files = await cursor.toArray();
    return files;
  }

  async deleteFile(_id: string) {
    return new Promise((resove, reject) => {
      this.gridfsBucket.delete(new ObjectId(_id), (error) => {
        if (error) {
          reject(error);
        } else resove();
      });
    });
  }

  async getImageBuffer(imageId: string | ObjectId): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
      let downloadStream = this.gridfsBucket.openDownloadStream(
        new ObjectId(imageId)
      );

      let chunks = [];
      downloadStream.on('data', (data) => {
        chunks.push(data);
      });
      downloadStream.once('error', reject);

      downloadStream.once('end', async () => {
        let imageMinBuffer = Buffer.concat(chunks);
        resolve(imageMinBuffer);
      });
    });
  }

  async getImageString(imageId: string | ObjectId): Promise<string> {
    let buffer = await this.getImageBuffer(imageId);
    return buffer.toString('base64');
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      let chunks = [];
      stream.on('data', (data) => {
        chunks.push(data);
      });
      stream.once('error', reject);
      stream.once('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  async getFileButter(idFile: string | ObjectId): Promise<Buffer> {
    let downloadStream = this.gridfsBucket.openDownloadStream(
      new ObjectId(idFile)
    );
    return await this.streamToBuffer(downloadStream);
  }
}

const mongodbGridfsService = new MongodbGridfsService();
export default mongodbGridfsService;
