import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Loader({text}) {
  return (
    <Transition
      show={true}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            </div>
            <p className="text-gray-600 text-sm font-medium">{text || "Loading..."}</p>
          </div>
        </div>
      </div>
    </Transition>
  );
}
