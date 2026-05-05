import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";

const gsts = ["05AAACI5950L1ZG", "24AAACI5950L1ZG"];
let types = {
  type1: [
    <th>SR NO.</th>,
    <th>CN DATA</th>,
    <th>CN NO.</th>,
    <th>FROM</th>,
    <th>DESTINATION</th>,
    <th>HSN/SAC CODE</th>,
    <th>TRANSPORT</th>,
    <th>SENDER</th>,
    <th>RECEIVER</th>,
    <th>NO. OF PKG</th>,
    <th>FREIGHT AMOUNT</th>,
    <th>TOTAL AMOUNT</th>,
  ],
  type2: [
    <th>SR NO.</th>,
    <th>CN DATA</th>,
    <th>CN NO.</th>,
    <th>FROM</th>,
    <th>DESTINATION</th>,
    <th>HSN/SAC CODE</th>,
    <th>TRANSPORT</th>,
    <th>NO. OF PKG</th>,
    <th>FREIGHT AMOUNT</th>,
    <th>TOTAL AMOUNT</th>,
  ],
};

// ✅ Separate component (clean approach)
function InputBox({ items }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [filtereditems, setFiltereditems] = useState(items || []);

  useEffect(
    function () {
      let fi =
        query === ""
          ? items || []
          : items?.filter((item) =>
              item?.toLowerCase().includes(query.toLowerCase())
            );
      setFiltereditems(fi);
    },
    [query]
  );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative flex-1">
        {/* Input */}
        <ComboboxInput
          className="w-full rounded-lg border-gray-300 bg-white py-2 pr-8 pl-3 text-sm focus:outline-none"
          displayValue={(item) => item}
          spellCheck={false}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Button */}
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </ComboboxButton>

        {/* Options */}
        <ComboboxOptions className="absolute mt-1 w-full rounded-lg bg-white shadow-lg z-10 max-h-60 overflow-auto">
          {filtereditems.map((item, id) => (
            <ComboboxOption
              key={id}
              value={item}
              className={({ active }) =>
                clsx(
                  "flex items-center gap-2 px-3 py-2 cursor-pointer",
                  active ? "bg-blue-100" : ""
                )
              }
            >
              {({ selected }) => (
                <>
                  <CheckIcon
                    className={clsx(
                      "w-4 h-4",
                      selected ? "visible text-blue-600" : "invisible"
                    )}
                  />
                  <span>{item}</span>
                </>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}

function Input(...props) {
  return (
    <input
      className="w-full border-gray-300 bg-white py-2 pr-8 pl-3 text-sm focus:outline-none"
      spellCheck={false}
      onChange={(e) => setQuery(e.target.value)}
      {...props}
    />
  );
}

const Table = () => {
  const [voiceData, setVoiceData] = useState([{}]);

  return (
    <main className="text-black min-h-screen w-full flex flex-col justify-center">
      <div className="w-[95%] mx-auto h-80 px-1/6 flex justify-between items-center">
        <table className="border w-1/4">
          <thead className="border">
            <tr>
              <th className="px-4">
                GSTIN - <InputBox items={gsts} />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-4">TO,</td>
            </tr>
            <tr>
              <td className="px-4">M/S ITC LIMITED,</td>
            </tr>
            <tr>
              <td className="px-4">PACKAGING</td>
            </tr>
            <tr>
              <td className="px-4">PLOT NO - 1, SECTOR 11,</td>
            </tr>
            <tr>
              <td className="px-4">INTEGRATED INDUSTRIAL ESTATE,</td>
            </tr>
            <tr>
              <td className="px-4">SIDCUL, HARIDWAR - 249403</td>
            </tr>
          </tbody>
        </table>
        <table className="border w-1/4">
          <thead className="border">
            <tr>
              <th className="px-4">GSTIN - 05EJVPS4650G1ZN</th>
            </tr>
          </thead>

          <tbody className="py-4">
            <tr>
              <td className="px-4">
                <b>Bill Date - </b>{" "}
                <Input
                  style={{
                    width: "66% !important",
                    borderRadius: "6px !important",
                  }}
                />{" "}
              </td>
            </tr>
            <tr>
              <td className="px-4">
                <b>Bill No. - </b>{" "}
                <Input
                  style={{
                    width: "66% !important",
                    borderRadius: "6px !important",
                  }}
                />{" "}
              </td>
            </tr>
            <tr>
              <td className="px-4">
                <b>RCM - </b> NO{" "}
              </td>
            </tr>
            <td className="px-4">
              <b>STATE - </b> UTTARAKHAND{" "}
            </td>
            <tr>
              <td className="px-4">
                <b>STATE CODE - </b> 05{" "}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table
        className="text-xs w-[90%] mx-auto border border-collapse text-center px-1/6 mtoo mb-20 relative"
        border={1}
      >
        <thead className="border">
          <tr className="border">{}</tr>
        </thead>
        <tbody>
          {voiceData.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                <Input />
              </td>
              <td>
                TOTAL AMOUNT
                {i != voiceData.length - 1 ? (
                  <button
                    className="absolute p-1 rounded-full bg-red-500 text-white ml-3 -mt-3 cursor-pointer"
                    onClick={() => {
                      let m = voiceData.filter((_, k) => k != i);
                      setVoiceData(m);
                    }}
                  >
                    <MinusCircleIcon className="text-white w-6 h-6" />
                  </button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} rowSpan={4}>
              <span className="flex justify-start items-end text-xs">
                <span className="flex justify-start items-end text-xs">
                  ENCL - AS ABOVE
                </span>
              </span>
            </td>
          </tr>
          <tr className="">
            <th colSpan={9}>TAXABLE VALUE</th>
            <td>
              {4 * 5}
              <button
                className="absolute p-1 rounded-full bg-blue-500 text-white ml-8 -mt-8"
                onClick={function () {
                  setVoiceData([...voiceData, {}]);
                }}
              >
                <PlusCircleIcon className="text-white w-6 h-6" />
              </button>
            </td>
          </tr>
          <tr className="">
            <th colSpan={9}>IGST 18%</th>
            <td>{4 * 5}</td>
          </tr>
          <tr className="">
            <th colSpan={9}>GRAND TOTAL</th>
            <td>{4 * 5}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
};

export default Table;
