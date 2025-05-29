import WebViewer from "@pdftron/webviewer";
import { useEffect, useRef } from "react";

export default function PDFViewerPendingTable() {

  const ref = useRef(null);

  useEffect(() => {
    WebViewer({
      path: '/lib/webviewer',
      
      initialDoc: '/sample-table-2.docx',
      enableOfficeEditing: true,
      licenseKey: 'demo:1745619411379:6100596e0300000000cec4e228950dd6be8e57b6f5fcff99172249fc5f',
    }, ref.current)
      .then((instance) => {
      })
  }, [])

  return (
    <div ref={ref} style={{ height: '100%' }}>

    </div>
  )
}