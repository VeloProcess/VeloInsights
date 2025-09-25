// v1.0.0
import React, { useCallback } from 'react';
import { useData } from '../context/DataContext';
import { processarPlanilha } from '../utils/dataParser';
import { useDropzone } from 'react-dropzone';

const uploaderStyle = {
  flex: 1, 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center',
  padding: '20px', 
  border: '2px dashed #0052cc', 
  borderRadius: '8px',
  backgroundColor: '#fafafa', 
  color: '#bdbdbd', 
  outline: 'none', 
  transition: 'border .24s ease-in-out',
  height: '80vh', 
  margin: '2rem',
  cursor: 'pointer'
};

function Uploader() {
  const { setRawData, setOperadores } = useData();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileBuffer = event.target.result;
      const { atendimentos, operadores } = processarPlanilha(fileBuffer);
      setRawData(atendimentos);
      setOperadores(operadores);
    };
    reader.readAsArrayBuffer(file);
  }, [setRawData, setOperadores]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 
      'text/csv': ['.csv']
    }
  });

  return (
    <div {...getRootProps({ style: uploaderStyle })}>
      <input {...getInputProps()} />
      {isDragActive ?
        <p>Solte a planilha aqui...</p> :
        <p>Arraste e solte sua planilha (.xlsx ou .csv) aqui, ou clique para selecionar</p>
      }
    </div>
  );
}
export default Uploader;
