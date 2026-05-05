import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Switch,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

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
  type3: [
    <th>SR NO.</th>,
    <th>CN DATA</th>,
    <th>CN NO.</th>,
    <th>FROM</th>,
    <th>DESTINATION</th>,
    <th>HSN/SAC CODE</th>,
    <th>TRANSPORT</th>,
    <th>INVOICE NO.</th>,
    <th>MATERIAL DESCRIPTION</th>,
    <th>VEHICLE NO.</th>,
    <th>NO. OF PKG</th>,
    <th>WEIGHT</th>,
    <th>RATE PER KG</th>,
    <th>FREIGHT AMOUNT</th>,
    <th>TOTAL AMOUNT</th>,
  ],
};

function Input(props) {
  return (
    <textarea
      className="w-full h-full [&::-webkit-scrollbar]:hidden resize-none overflow-hidden border border-gray-800 py-2 px-3 text-sm focus:outline-none"
      spellCheck={false}
      onChange={(e) => props.tululu(props.Key, e.target.value, props.idx)}
      {...props}
    />
  );
}

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

const Table = () => {
  const router = useRouter();
  const [head, setHead] = useState([]);
  const [igst, setIgst] = useState(false);
  const [template, setTemplate] = useState({});
  const [voiceData, setVoiceData] = useState([template]);

  function tululu(key, val, i) {
    setVoiceData((prevData) => {
      const newData = [...prevData];
      newData[i] = { ...newData[i], [key]: val };
      return newData;
    });
  }

  useEffect(() => {
    let { type } = router.query;

    if (type) {
      setHead(types[type]);

      let temp = types[type].reduce((acc, tag) => {
        const key = tag.props.children
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/[^a-zA-Z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "")
          .toLowerCase();

        acc[key] = "";
        return acc;
      }, {});

      setVoiceData([{ ...temp }]);
      setTemplate(temp);
    }
  }, [router.query]);

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
            <tr>
              <td className="px-4">
                <b>STATE - </b> UTTARAKHAND{" "}
              </td>
            </tr>
            <tr>
              <td className="px-4">
                <b>STATE CODE - </b> 05{" "}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {template && (
        <table
          className="text-xs w-[90%] mx-auto border border-collapse text-center px-1/6 mtoo mb-20 relative"
          border={1}
        >
          <thead className="border">
            <tr className="border">{}</tr>
          </thead>
          <tbody>
            <tr>{...head}</tr>
            {voiceData.map((r, i) => (
              <>
                <tr key={i}>
                  {Object.keys(voiceData[i]).map((o, j) => (
                    <td key={j}>
                      <Input
                        value={voiceData[i][o]}
                        idx={i}
                        Key={o}
                        {...{ tululu }}
                      />
                    </td>
                  ))}
                </tr>
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
              </>
            ))}
            <tr>
              <td colSpan={4} rowSpan={igst ? 4 : 5}>
                <span className="flex justify-start items-end text-xs">
                  <span className="flex justify-start items-end text-xs">
                    ENCL - AS ABOVE
                  </span>
                </span>
              </td>
            </tr>
            <tr className="">
              <th colSpan={head.length - 5}>TAXABLE VALUE</th>
              <td>
                {4 * 5}
                <button
                  className="absolute p-1 rounded-full bg-blue-500 text-white ml-8 -mt-8"
                  onClick={function () {
                    setVoiceData([...voiceData, template]);
                  }}
                >
                  <PlusCircleIcon className="text-white w-6 h-6" />
                </button>
              </td>
            </tr>
            {!igst ? (
              <>
                <tr className="">
                  <th colSpan={head.length - 5}>CGST 9%</th>
                  <td>{4 * 5}</td>
                </tr>
                <tr className="">
                  <th colSpan={head.length - 5}>SGST 9%</th>
                  <td>{4 * 5}</td>
                </tr>
              </>
            ) : (
              <tr className="">
                <th colSpan={head.length - 5}>IGST 18%</th>
                <td>{4 * 5}</td>
              </tr>
            )}

            <tr className="">
              <th colSpan={head.length - 5}>GRAND TOTAL</th>
              <td>{4 * 5}</td>
            </tr>
          </tbody>
        </table>
      )}

      <Switch
        checked={igst}
        onChange={setIgst}
        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-black/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-black/10 data-focus:outline data-focus:outline-bg-black"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
        />
      </Switch>
    </main>
  );
};

export default Table;
