import React, { useState } from "react";
import { RadioGroup } from "@headlessui/react";

const plans = [
  {
    name: "Gratuit",
    price: "0$/mois",
  },
  {
    name: "Starter",
    price: "6$/mois",
  },
];

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#000" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Tiers = ({ selected, setSelected }) => {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected}>
          <div className="flex flex-col gap-2">
            {plans.map((plan) => (
              <RadioGroup.Option
                key={plan.name}
                value={plan}
                className={({ active, checked }) =>
                  `${
                    active || checked
                      ? "bg-teal-400 border-2 border-teal-900 text-white"
                      : "text-black"
                  }
                  border-2  border-slate-200 relative flex cursor-pointer rounded-lg p-4 shadow-md focus:outline-none`
                }
                onClick={() => setSelected(plan.name)}
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="">
                          <RadioGroup.Label as="p" className={`font-medium`}>
                            {plan.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline text-sm ${
                              checked ? "text-sky-100" : "text-gray-500"
                            }`}
                          >
                            <span>{plan.price}</span>{" "}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="text-black">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Tiers;
