import BaseSvc from './BaseSvc';

class File extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/file';
  }

  async upload(files, type) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    formData.append('resourceType', type);
    const { data } = await this.api.post('/upload', formData);
    return data;
  }

  async download(idFile) {
    const { data } = await this.api.get(`/download?idFile=${idFile}`);
    return data;
  }

  async preview(params) {
    const formData = new FormData();
    formData.append('tempId', params.tempId);
    formData.append('data', JSON.stringify(params.data));
    formData.append('fileName', params.fileName);

    const { data } = await this.api.post('/template/preview', params);
    return data;
  }

  async fillData(params) {
    const { data } = await this.api.post('/template/data', params);
    return data;
  }
}

const filesSvc = new File();

export default filesSvc;
