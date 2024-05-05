"use client";
import {
  CSSProperties,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { shuffle, chunk } from "lodash";

export default function Home() {
  const [questions, setQuestions] = useState("");
  const [numberSheets, setNumberSheets] = useState(5);
  const [gridSize, setGridSize] = useState(5);
  const [freeSpaceText, setFreeSpaceText] = useState("FREE SPACE");

  const handleChange = useCallback(
    (setter: Dispatch<SetStateAction<any>>) =>
      (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
        setter(event?.target.value),
    []
  );
  const sheets = useMemo(() => {
    const size = isNaN(gridSize) ? 5 : +(gridSize ?? 5);
    const sheetsCount = isNaN(numberSheets) ? 5 : +(numberSheets ?? 5);
    const splitQuestions = questions
      .split("\n")
      .map((question) => question.trim());
    return new Array(sheetsCount).fill(true).map(() => {
      let arraySize = size * size - 1;
      if (splitQuestions.length > arraySize) {
        arraySize = splitQuestions.length;
      }
      const indices: (number | string)[] = new Array(arraySize)
        .fill(true)
        .map((_, i) => i);

      const shuffled = shuffle(indices).slice(0, size * size - 1);
      const middleIndex = Math.floor(size / 2) * size + Math.floor(size / 2);
      shuffled.splice(middleIndex, 0, freeSpaceText);

      const questions = shuffled.map((item) =>
        typeof item === "number" ? splitQuestions[item] : item
      );
      return chunk(questions, size);
    });
  }, [questions, numberSheets, gridSize, freeSpaceText]);

  const handlePrint = useCallback(() => print(), []);

  const tdStyle: CSSProperties = useMemo(
    () => ({
      width: 100 / +gridSize + "%",
      textAlign: "center",
      height: 0,
      paddingBottom: 100 / +gridSize + "%",
      position: "relative",
      border: "1px solid black",
    }),
    [gridSize]
  );

  const tdSpanStyle: CSSProperties = useMemo(
    () => ({
      top: 0,
      left: 0,
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
    }),
    []
  );

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 justify-items-center grid">
      <div className="w-full max-w-prose print:hidden pt-8">
        <form>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="questions"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bingo Questions
              </label>
              <div className="mt-2">
                <textarea
                  id="questions"
                  name="questions"
                  onChange={handleChange(setQuestions)}
                  value={questions}
                  rows={10}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Each question should be in a new line.
              </p>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="freeSpaceText"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Free space text
              </label>
              <div className="mt-2">
                <input
                  name="freeSpaceText"
                  id="freeSpaceText"
                  value={freeSpaceText}
                  onChange={handleChange(setFreeSpaceText)}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="numberSheets"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Number of Sheets
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="numberSheets"
                  id="numberSheets"
                  value={numberSheets}
                  onChange={handleChange(setNumberSheets)}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="gridSize"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                How many rows/columns?
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="gridSize"
                  id="gridSize"
                  value={gridSize}
                  onChange={handleChange(setGridSize)}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </form>
        <div className="relative pt-8">
          <dt className="text-base font-semibold leading-7 text-gray-900">
            Usage
          </dt>
          <dd className="my-2 text-base leading-7 text-gray-600">
            Just print the page using you browser&apos;s print feature and the
            bingo sheets will be generated.
          </dd>
          <button
            onClick={handlePrint}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Print
          </button>
        </div>
      </div>
      {sheets.map((rows, si) => (
        <div
          key={si}
          className="w-full py-16 max-w-prose hidden print:block"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="w-1/3 h-12 border-b border-black" />
          <dd className="text-xs mb-4 mt-1">Name</dd>

          <table className="w-full">
            <tbody>
              {rows.map((cells, ri) => (
                <tr key={ri}>
                  {cells.map((cell, ci) => (
                    <td key={ci} style={tdStyle}>
                      <span style={tdSpanStyle}>{cell}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </main>
  );
}
