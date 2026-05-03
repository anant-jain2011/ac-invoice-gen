import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useEffect, useState } from "react";

const gsts = ["05AAACI5950L1ZG", "24AAACI5950L1ZG"];

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

function Input() {
  return (
    <input
      className="w-2/3 rounded-lg border-gray-300 bg-white py-2 pr-8 pl-3 text-sm focus:outline-none"
      displayValue={(item) => item}
      spellCheck={false}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

const Table = () => {
  const [voiceData, setVoiceData] = useState([]);

  return (
    <main className="text-black min-h-screen w-full flex justify-center pt-96">
      <div className="w-[95%] h-80 px-1/6 flex justify-between items-center bg-orange-100">
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
            <td className="px-4">PLOT NO - 1, SECTOR 11,</td>
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
                <b>Bill Date - </b> <Input />{" "}
              </td>
            </tr>
            <tr>
              <td className="px-4">
                <b>Bill No. - </b> <Input />{" "}
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

      <table>
        <thead>
          <tr>
            <th>GGGG</th>
            <th>CN DATA</th>
            <th>CN NO.</th>
            <th>FROM</th>
            <th>DESTINATION</th>
            <th>HSN/SAC CODE</th>
            <th>TRANSPORT</th>
            <th>SENDER</th>
            <th>RECEIVER</th>
            <th>VEHICLE NO.</th>
            <th>NO. OF PKG</th>
            <th>FREIGHT AMOUNT</th>
            <th>VEHICLE CHARGES</th>
            <th>TOTAL AMOUNT</th>
          </tr>
        </thead>
      </table>
    </main>
  );
};

export default Table;
