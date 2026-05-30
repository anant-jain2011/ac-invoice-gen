import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Switch,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import { GoogleGenAI } from "@google/genai";

const gsts = ["05AAACI5950L1ZG", "24AAACI5950L1ZG"];
const adds = {
  "05AAACI5950L1ZG": <tbody>
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
  </tbody>,
  "24AAACI5950L1ZG": <tbody>
    <tr>
      <td className="px-4">TO,</td>
    </tr>
    <tr>
      <td className="px-4">M/S ITC LIMITED (SBU-PPB) - AHM,</td>
    </tr>
    <tr>
      <td className="px-4">MEMDABAD-NADIAD ROAD,</td>
    </tr>
    <tr>
      <td className="px-4">PAIKI, SILOD VILLAGE,</td>
    </tr>
    <tr>
      <td className="px-4">NADIAD TALUK, KHEDA DISTRICT,</td>
    </tr>
    <tr>
      <td className="px-4">GUJARAT, INDIA - 249403</td>
    </tr>
  </tbody>
};

let types = {
  type1: [
    <th>SR NO.</th>,
    <th>CN DATE</th>,
    <th>CN NO.</th>,
    <th>FROM</th>,
    <th>DESTINATION</th>,
    <th>HSN/SAC CODE</th>,
    <th>TRANSPORT</th>,
    <th>SENDER</th>,
    <th>RECEIVER</th>,
    <th>NO. OF PKG</th>,
    <th>WEIGHT</th>,
    <th>FREIGHT AMOUNT</th>,
    <th>TOTAL AMOUNT</th>,
  ],
  type2: [
    <th>SR NO.</th>,
    <th>CN DATE</th>,
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
    <th>CN DATE</th>,
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
    <th>FREIGHT AMOUNT</th>,
    <th>TOTAL AMOUNT</th>,
  ],
};

let mkeys = ["rate_per_kg", "freight_amount", "weight", "vehicle_charges"];

function Input(props) {
  return (
    <textarea
      className="w-full h-full [&::-webkit-scrollbar]:hidden resize-none overflow-hidden border-gray-800 py-2 px-3 text-sm focus:outline-none"
      autoComplete={"off"}
      spellCheck={false}
      onChange={(e) => props.tululu(props.Key, e.target.value, props.idx)}
      {...props}
    />
  );
}

function InputBox({ items, selected, setSelected, com }) {
  const its = com ? items.map((a) => a.text) : items;

  const [query, setQuery] = useState("");

  const filtereditems =
    query === ""
      ? its || []
      : its?.filter((item) =>
        item?.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className={"relative " + (com ? "w-full" : "w-2/3")}>
        <ComboboxButton className="w-full">
          <ComboboxInput
            className="w-full rounded-lg border-gray-300 bg-white py-2 px-3 text-sm focus:outline-none"
            autoComplete="off"
            spellCheck={false}
            displayValue={(item) => item || ""}
            value={com ? selected : undefined}
            onChange={(e) => {
              const val = e.target.value;

              setQuery(val);

              if (com) {
                setSelected(val);
              }
            }}
          />
        </ComboboxButton>

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
  const ref = useRef();
  const [gt, setGt] = useState(0);
  const [words, setWords] = useState("");
  const [head, setHead] = useState([]);
  const [template, setTemplate] = useState({});
  const [loading, setLoading] = useState(false);
  const [saves, setSaves] = useState([]);
  const [dw, setDw] = useState({});
  const [bill, setBill] = useState({
    date: "",
    code: "",
    gst: "",
    add: "",
    igst: false,
    t3: { rpk: false, vc: false },
  });
  const [voiceData, setVoiceData] = useState([]);
  const resizeRef = useRef(null);

  function startResize(e, key) {
    resizeRef.current = {
      key,
      startX: e.clientX,
      startWidth: dw[key] || 60,
    };
  }

  useEffect(() => {
    function onMove(e) {
      if (!resizeRef.current) return;

      const { key, startX, startWidth } = resizeRef.current;

      const newWidth = Math.max(
        30,
        startWidth + e.clientX - startX
      );

      setDw(prev => {
        let r = { ...prev, [key]: newWidth };
        localStorage.setItem("sData", JSON.stringify(r));
        return r;
      });

    }

    function onUp() {
      resizeRef.current = null;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  let updateRPKVC = (rpk, vc) => {
    if (router.query.type !== "type3") return;

    let hh = [...types.type3];

    const freightIdx = hh.findIndex(
      h => h.props.children === "FREIGHT AMOUNT"
    );

    if (rpk) {
      hh.splice(freightIdx, 0, <th>RATE PER KG</th>);
    }

    if (vc) {
      const idx = hh.findIndex(
        h => h.props.children === "FREIGHT AMOUNT"
      );

      hh.splice(
        idx + 1,
        0,
        <th>VEHICLE CHARGES</th>
      );
    }

    setHead(hh);
  };

  useEffect(() => {
    updateRPKVC(bill.t3.rpk, bill.t3.vc);
  }, [bill.t3]);

  useEffect(() => {
    const newTemplate = head
      .map(tag => get_(tag.props.children))
      .reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});

    setTemplate(newTemplate);

    setVoiceData(prev =>
      prev.map(row => {
        const newRow = { ...row };

        Object.keys(newTemplate).forEach(key => {
          if (!(key in newRow)) {
            newRow[key] = "";
          }
        });

        Object.keys(newRow).forEach(key => {
          if (!(key in newTemplate)) {
            delete newRow[key];
          }
        });

        return newRow;
      })
    );
  }, [head]);

  function hasSd(k) {
    return parseInt(k) == k ? parseInt(k) : +k;
  }

  const save = async () => {
    setLoading({ text: "Saving invoice...", st: true });

    var { id, type } = router.query;

    let recentDataRaw = localStorage.getItem("recents");
    let recentData = recentDataRaw ? JSON.parse(recentDataRaw) : [];

    if (!id) {
      const resp = await fetch("/api/add-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bill, voiceData, type, words }),
      });

      if (recentData.length == 3) {
        recentData.pop();
      }

      recentData = [{ bill, voiceData, type, words }, ...recentData];

      localStorage.setItem("recents", JSON.stringify(recentData));

      let data = await resp.json();
      id = data.id;
    } else {
      console.log("Saving bill:", voiceData, head, template);
      await fetch("/api/add-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, bill, voiceData, type, words }),
      });
    }

    voiceData.forEach((row, index) => {
      ["from", "destination", "sender", "receiver"].forEach((field) => {
        let doe = [];
        if (field && row[field] && !saves.find(s => s.text == row[field] && s.type == field) && !doe.includes(row[field])) {
          doe.push(row[field]);
          fetch("/api/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: row[field], type: field })
          });
        }
      });
    });

    router.push("/table?id=" + id + "&type=" + router.query.type);

    setLoading({ text: "", st: false });
    toast.success("Invoice saved successfully!");
  };

  const getPdf = async () => {
    setLoading({ text: "Generating PDF...", st: true });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    body {
      padding: 20px;
    }

    table {
      border-collapse: collapse;
    }

    .mtoo td {
  border: 2px solid black;
}
.mtoo th {
  border: 2px solid black;
}
  </style>
</head>

<body>
  ${ref?.current?.outerHTML}
</body>
</html>
`;

    const res = await fetch("/api/pupet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html }),
    });

    if (!res.ok) {
      console.log(res?.json());
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    setLoading({ text: "", st: false });

    toast.success("PDF generated successfully!");
  };

  function get_(x) {
    return x.replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();
  }

  async function getWords() {
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "Return the amount in words, and nothing else, for eg: 1234.7 -> 'one thousand two hundred thirty four rupees and seventy paise only', do not include the single quotes, only write paise when there is anything but 0 in the decimal part,  the num is : " + (gt * 1.18),
    });

    console.log(response.text);

    setWords(response?.text?.toUpperCase());
  }

  function tululu(key, val, i) {
    setVoiceData((prevData) => {
      const newData = [...prevData];
      let amt = 0;
      newData[i] = { ...newData[i], [key]: mkeys.includes(key) ? val.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, '$1') : val };
      if (router.query.type == "type3" && bill.t3.rpk) {
        newData[i].freight_amount = +(newData[i].rate_per_kg || 0) * +(newData[i].weight || 0);
      }
      newData[i].total_amount = +(newData[i].freight_amount || 0) + +(bill?.t3?.vc ? (newData[i].vehicle_charges || 0) : 0);
      newData.map(a => amt += +a.total_amount);
      setGt(amt);
      return newData;
    });
  }

  const updateSr = () => {
    setVoiceData(prev =>
      prev.map((row, i) => ({
        ...row,
        sr_no: i + 1,
      }))
    );
  };

  useEffect(() => {
    updateSr();
    let amt = 0;
    voiceData.map(a => amt += +a.total_amount);
    setGt(amt);
  }, [voiceData?.length]);

  useEffect(() => {
    let { type, id } = router.query;

    window.addEventListener('beforeunload', (event) => {
      // Cancel the event as stated by the standard.
      event.preventDefault();

      // Required by some browsers (e.g., Chrome) to trigger the prompt.
      event.returnValue = '';
    });

    let sd = JSON.parse(localStorage.getItem("sData") || "{}");
    console.log(sd);

    setDw(sd);

    if (type) {
      setHead(types[type]);

      let temp = {};
      types[type].map((tag) => {
        const key = get_(tag.props.children);

        temp[key] = "";
        temp.sr_no = 1;
      }, {});

      setVoiceData([{ ...temp }]);
      setTemplate(temp);
    }

    fetch("/api/get-saved").then(res => res.json()).then(data => {
      setSaves(data);
    });

    if (id) {
      fetch("/api/get-voice?id=" + id).then(res => res.json()).then(data => {
        console.log(data);

        let bill2 = data.bill;
        let temp = data.voiceData;
        delete bill2._id;
        temp = temp.map(v => {
          delete v._id;
          return v;
        })
        setVoiceData(temp);
        setBill({ ...bill2, t3: { rpk: bill2.t3?.rpk || false, vc: bill2.t3?.vc || false } });
        setWords(data.words);
        //also set gt
        let amt = 0;
        temp.map(a => amt += +a.total_amount);
        setGt(amt);
      });
    }

    setBill(prev => ({ ...prev, t3: { rpk: router.query.type == "type3" ? prev.t3.rpk : false, vc: router.query.type == "type3" ? prev.t3.vc : false } }));
  }, [router.query]);

  if (voiceData.length && head.length && Object.keys(bill).length) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-100 viawhite to-slate-200 text-slate-900 py-10" draggable={false}>
        <div className="w-[95%] mx-auto h-80 px-1/6 flex justify-between items-center">
          <table className="border w-1/4">
            <thead className="border border-black">
              <tr>
                <th className="px-4 flex items-center">
                  GSTIN - <InputBox items={gsts} selected={bill.gst} setSelected={(val) => setBill({ ...bill, gst: val })} />
                </th>
              </tr>
            </thead>
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
                  <input
                    onChange={(e) => setBill({ ...bill, date: e.target.value })}
                    value={bill.date}
                    type="date"
                    className="focus:outline-none pl-1"
                    style={{
                      width: "66% !important",
                      borderWidth: 1.5,
                      borderRadius: 6,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4">
                  <b>Bill No. - </b>{" "}
                  <input
                    onChange={(e) => setBill({ ...bill, code: e.target.value })}
                    value={bill.code}
                    className="focus:outline-none pl-1"
                    style={{
                      width: "66% !important",
                      borderWidth: 1.5,
                      borderRadius: 6,
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

        <table
          className="text-xs w-[90%] mx-auto border border-black border-collapse text-center px-1/6 mtoo mb-4 relative"
          border={1}
        >
          <tbody>
            <tr>
              {...head}
              <th className="px-2"> Actions </th>
            </tr>
            {voiceData.map((r, i) => (
              <tr key={i}>
                {head.map((tag, j) => {
                  const o = get_(tag.props.children);

                  if (["from", "destination", "sender", "receiver"].includes(o)) {
                    return <td key={j}>
                      <InputBox
                        com
                        setSelected={(val) => tululu(o, val, i)}
                        selected={r[o]}
                        items={saves.filter(s => s.type == o)}
                      />
                    </td>;
                  }

                  return <td key={j}>
                    <Input
                      value={r[o]}
                      disabled={["sr_no", "total_amount"].includes(o) || (router.query.type == "type3" && (o == "freight_amount") && bill.t3.rpk)}
                      idx={i}
                      Key={o}
                      {...{ tululu }}
                    />
                  </td>
                })}
                <td>
                  {voiceData.length > 1 ?
                    <button
                      className="p-1 rounded-full bg-red-500 text-white cursor-pointer"
                      onClick={() => {
                        let m = voiceData.filter((_, k) => k != i);
                        setVoiceData(m);
                      }}
                    >
                      <MinusCircleIcon className="text-white w-6 h-6" />
                    </button> : <></>
                  }
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} rowSpan={bill.igst ? 4 : 5}>
                <span className="flex justify-start items-end text-xs w-full h-full">
                  {/* <span className="h-fit w-fit"> */}
                  ENCL - AS ABOVE
                  {/* </span> */}
                </span>
              </td>
            </tr>
            <tr className="">
              <th colSpan={head.length - 5}>TAXABLE VALUE</th>
              <td>
                {(+gt).toFixed(2)}
              </td>
              <td rowSpan={bill.igst ? 3 : 4} className="h-40">
                <button
                  className="p-1 rounded-full bg-blue-500 text-white cursor-pointer"
                  onClick={function () {
                    setVoiceData([...voiceData, template]);
                  }}
                >
                  <PlusCircleIcon className="text-white w-6 h-6" />
                </button>
              </td>
            </tr>
            {!bill.igst ? (
              <>
                <tr className="">
                  <th colSpan={head.length - 5}>CGST 9%</th>
                  <td>{(gt * 0.09).toFixed(2)}</td>
                </tr>
                <tr className="">
                  <th colSpan={head.length - 5}>SGST 9%</th>
                  <td>{(gt * 0.09).toFixed(2)}</td>
                </tr>
              </>
            ) : (
              <tr className="">
                <th colSpan={head.length - 5}>IGST 18%</th>
                <td>{(gt * 0.18).toFixed(2)}</td>
              </tr>
            )}

            <tr className="">
              <th colSpan={head.length - 5}>GRAND TOTAL</th>
              <td>{(gt * 1.18).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mx-auto w-[90%] flex">
          IGST is {bill.igst ? "YES" : "NO"}
          <Switch
            checked={bill.igst}
            onChange={(checked) => setBill({ ...bill, igst: checked })}
            className={"group relative flex h-7 w-14 cursor-pointer rounded-full ml-4 -mt-1 p-1 " + (!bill.igst ? "bg-black/20" : "bg-blue-700 ")}
          >
            <span
              aria-hidden="true"
              className={"pointer-events-none inline-block size-5 translate-x-0 rounded-full shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7 " + (!bill.igst ? "bg-gray-500" : "bg-white")}
            />
          </Switch>
        </div>

        {router.query.type === "type3" && <>
          <div className="mx-auto w-[90%] flex">
            Rate / KG is {bill.t3.rpk ? "Present" : "Not Present"}
            <Switch
              checked={bill.t3.rpk}
              onChange={(checked) => setBill({ ...bill, t3: { ...bill.t3, rpk: checked } })}
              className={"group relative flex h-7 w-14 cursor-pointer rounded-full ml-4 -mt-1 p-1 " + (!bill.t3.rpk ? "bg-black/20" : "bg-blue-700 ")}
            >
              <span
                aria-hidden="true"
                className={"pointer-events-none inline-block size-5 translate-x-0 rounded-full shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7 " + (!bill.t3.rpk ? "bg-gray-500" : "bg-white")}
              />
            </Switch>
          </div>
          <div className="mx-auto w-[90%] flex">
            Vehicle Charges are {bill.t3.vc ? "Present" : "Not Present"}
            <Switch
              checked={bill.t3.vc}
              onChange={(checked) => setBill({ ...bill, t3: { ...bill.t3, vc: checked } })}
              className={"group relative flex h-7 w-14 cursor-pointer rounded-full ml-4 -mt-1 p-1 " + (!bill.t3.vc ? "bg-black/20" : "bg-blue-700 ")}
            >
              <span
                aria-hidden="true"
                className={"pointer-events-none inline-block size-5 translate-x-0 rounded-full shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7 " + (!bill.t3.vc ? "bg-gray-500" : "bg-white")}
              />
            </Switch>
          </div>
        </>}

        <h1 className="text-center text-4xl my-12">Preview Table</h1>

        <div className="w-[95%] mx-auto" ref={ref}>
          <div className="bg-black h-0.5" />

          <div className="w-full px-1/6 flex justify-between items-center my-8" style={{ fontSize: 15, height: 300 }}>
            <table className="border-2 border-black w-1/4" height={264}>
              <thead className="border-2 border-black">
                <tr>
                  <th className="px-4 h-10 text-left">
                    GSTIN - {bill.gst}
                  </th>
                </tr>
              </thead>

              {/* FIX: Removed the wrapper <div>. The `adds` object already provides the <tbody> */}
              {bill.gst && adds[bill.gst] ? (
                <tbody className="flex flex-col h-full justify-center">
                  {adds[bill.gst].props.children}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td className="px-4 py-2 text-gray-400 italic">No GSTIN Selected</td>
                  </tr>
                </tbody>
              )}
            </table>

            <table className="border-2 border-black w-1/4 my-20" height={264}>
              <thead className="border-2 border-black">
                <tr>
                  <th className="px-4 h-10 text-left">GSTIN - 05EJVPS4650G1ZN</th>
                </tr>
              </thead>

              <div className="flex items-center h-full">
                <tbody className="py-4 flex flex-col h-full justify-center">
                  <tr>
                    <td className="px-4">
                      <b>BILL DATE - </b>{" "}
                      <span style={{ letterSpacing: 1 }}>{bill.date.split("-").reverse().join("/")}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4">
                      <b>BILL NO - </b>{" "}
                      {bill.code}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4">
                      <b>RCM (Y/N) - </b> NO{" "}
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
              </div>
            </table>
          </div>

          <table
            className="text-xs w-full border-2 border-collapse text-center px-1/6 mtoo mb-4 relative"
            style={{
              tableLayout: "fixed",
              width: "max-content",
              minWidth: "100%",
            }}
          >
            <tbody>
              <tr className="h-12">
                {head.map((tag, j) => {
                  const key = get_(tag.props.children);

                  return (
                    <th
                      key={j}
                      className="relative px-2"
                      style={{
                        width: dw[key] || 60,
                        minWidth: 40,
                      }}
                    >
                      {tag.props.children}

                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize select-none"
                        onMouseDown={(e) => startResize(e, key)}
                      />
                    </th>
                  );
                })}
              </tr>
              {voiceData.map((r, i) => (
                <tr key={i}>
                  {head.map((tag, j) => {
                    const o = get_(tag.props.children);
                    let gc = "h-20 min-h-20 px-1 overflow-hidden break-words whitespace-pre-wrap";

                    if (o == "hsn_sac_code") {
                      return <td key={j} className={gc} style={{ width: dw[o] }}>996812</td>
                    }
                    else if (o == "sr_no") {
                      return <td key={j} className={gc + " w-8"}>{voiceData[i][o]}</td>
                    }
                    else if (["freight_amount", "total_amount", "weight", "vehicle_charges"].includes(o)) {
                      return (
                        <td key={j} className={gc} style={{ width: dw[o] }}>
                          {["freight_amount", "total_amount", "vehicle_charges"].includes(o) && `RS. ${parseInt(voiceData[i][o] || 0).toLocaleString("en-IN")} /-`}
                          {o == "weight" && ((router.query.type != "type1") ? voiceData[i][o] + " KG" : "SM")}
                        </td>
                      )
                    }
                    return <td key={j} className={gc} style={{ width: dw[o] }}>{voiceData[i][o] + ((o == "rate_per_kg") ? " /-" : "")}</td>
                  })}
                </tr>
              ))}
              <tr>
                <td colSpan={4} rowSpan={bill.igst ? 4 : 5} className="h-40">
                  <div className="flex items-end text-xs w-full h-full">
                    <div className="h-4 w-fit">
                      ENCL - AS ABOVE
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="h-14">
                <th colSpan={head.length - 5} className="text-right pr-10">TAXABLE VALUE</th>
                <td>RS. {hasSd(gt).toLocaleString("en-IN")} /-</td>
              </tr>
              {!bill.igst ? (
                <>
                  <tr className="h-14">
                    <th colSpan={head.length - 5} className="text-right pr-10">CGST 9%</th>
                    <td>RS. {hasSd((gt * 0.09).toFixed(2)).toLocaleString("en-IN")} /-</td>
                  </tr>
                  <tr className="h-14">
                    <th colSpan={head.length - 5} className="text-right pr-10">SGST 9%</th>
                    <td>RS. {hasSd((gt * 0.09).toFixed(2)).toLocaleString("en-IN")} /-</td>
                  </tr>
                </>
              ) : (
                <tr className="h-14">
                  <th colSpan={head.length - 5} className="text-right pr-10">IGST 18%</th>
                  <td>RS. {hasSd((gt * 0.18).toFixed(2)).toLocaleString("en-IN")} /-</td>
                </tr>
              )}

              <tr className="h-14">
                <th colSpan={head.length - 5} className="text-right pr-10">GRAND TOTAL</th>
                <td><b>RS. {hasSd((gt + gt * 0.18).toFixed(2)).toLocaleString("en-IN")} /-</b></td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between w-full font-bold mt-12" style={{ height: 270 }}>
            <div className="border-2 border-black px-10 flex flex-col justify-between max-w-96 relative h-full">
              <span className="text-xs mt-2" onClick={getWords}>TOTAL AMOUNT IN WORDS -</span>
              <div className="self-center break-words text-balance -mt-10">{words}.</div>
              <div></div>
              <div className="absolute -bottom-4 -mx-10" style={{ fontSize: 10, textAlign: "left" }}>COMPUTER GENERATED BILL</div>
            </div>
            <div className="border-2 border-black px-10 flex flex-col justify-between text-center relative">
              <div className="text-xs block mt-2">E. & O.E <br /> FOR, ADITYA CARGO MOVERS TRANSPORT AND GOODS SERVICE</div>
              <div className="text-xs block">AUTHORISED SIGNATORY</div>
              <div className="self-center absolute -bottom-4" style={{ fontSize: 10, textAlign: "center" }}>CERTIFIED THAT THE PARTICULARS GIVEN ABOVE ARE TRUE AND CORRECT</div>
            </div>
          </div>
        </div>

        <button className="mx-auto px-3 py-2 bg-blue-600 text-white rounded-lg block mt-16 cursor-pointer" onClick={() => save(ref?.current)}>Save</button>
        <button className="mx-auto px-3 py-2 bg-blue-600 text-white rounded-lg block mt-4 cursor-pointer" onClick={() => getPdf(ref?.current)}>Get PDF</button>

        {loading.st && <Loader text={loading.text} />}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </main>
    );
  } else {
    return <Loader text="Loading..." />;
  }
};

export default Table;
