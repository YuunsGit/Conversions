import { useEffect, useState } from "react";
import Page from "./Page";
import { ReactComponent as Gear } from "../img/Gear.svg";
import { pdfjs } from "react-pdf/dist/esm/entry.webpack";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SelectPages(props) {
  const [selects, setSelects] = useState(new Set());
  const [pages, setPages] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    const pdfDoc = await pdfjs.getDocument({ data: props.fileBuffer }).promise;
    const newPages = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const pdfPage = await pdfDoc.getPage(i);
      const page = (
        <Page
          page={pdfPage}
          pageNum={i}
          selects={selects}
          setSelects={setSelects}
        />
      );
      newPages.push(page);
    }
    setPages(newPages);
  };

  const splitAndSave = () => {
    setProcessing(true);
    props.split(selects, pages.length);
  };

  return (
    <>
      <h2 className="prose prose-stone text-center mx-auto mb-6 text-xl">
        Select pages to extract:
      </h2>
      <div
        id="page-container"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mx-auto"
      >
        {pages}
      </div>
      {processing ? (
        <div className="block mx-auto mt-8 px-10 max-w-max md:ma-10 h-auto">
          <Gear className="h-14 w-14" />
        </div>
      ) : (
        <div
          className="block mx-auto mt-8 bg-lime-500 rounded-md px-10 py-5 max-w-max md:ma-10 h-auto text-white font-semibold text-l select-none hover:bg-lime-600 cursor-pointer"
          onClick={splitAndSave}
        >
          SPLIT & SAVE
        </div>
      )}
      <div
        onClick={() => window.location.reload(false)}
        className="block mx-auto my-6 rounded-md max-w-max md:ma-10 h-auto text-stone-500 hover:text-stone-700 font-semibold select-none cursor-pointer"
      >
        GO BACK
      </div>
    </>
  );
}
