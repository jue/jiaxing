import findIndex from 'lodash/findIndex';
import React from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = (props: {
  files: File[];
  setFiles: Function;
  accept: string;
  maxSize?: number;
  children: string | React.ReactNode;
}) => {
  const { files = [], setFiles, accept, maxSize, children } = props;

  const onDrop = useCallback(
    (...acceptedFiles) => {
      const addFiles = [];
      for (const file of acceptedFiles[0].length
        ? acceptedFiles[0]
        : acceptedFiles[1]) {
        const index = findIndex(files, (f) => f.name === file.name);
        if (index === -1) {
          addFiles.push(file);
        }
      }
      let fs = [
        ...files,
        ...addFiles,
        // ...acceptedFiles.map(file =>
        //   Object.assign(file, {
        //     preview: URL.createObjectURL(file),
        //   })
        // ),
      ];
      if (maxSize) {
        fs = fs.slice(fs.length - maxSize);
      }
      setFiles(fs);
    },
    [files]
  );
  const opts: any = {
    onDrop,
    accept,
  };
  if (maxSize) {
    opts.maxSize = maxSize;
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone(opts);

  return (
    <div {...getRootProps({})}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default Dropzone;
