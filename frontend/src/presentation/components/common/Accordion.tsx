import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border border-gray-200 rounded-lg mb-2">
          <Disclosure.Button className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset flex justify-between items-center">
            <span className="font-medium text-gray-900">{title}</span>
            <ChevronDown
              className={`${
                open ? "transform rotate-180" : ""
              } h-5 w-5 text-gray-500 transition-transform duration-200`}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="px-4 py-3 bg-white">
            {children}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
}) => {
  if (allowMultiple) {
    return (
      <div>
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            defaultOpen={item.defaultOpen}
          >
            {item.children}
          </AccordionItem>
        ))}
      </div>
    );
  }

  return (
    <div>
      {items.map((item, index) => (
        <Disclosure key={index}>
          {({ open }) => (
            <div className="border border-gray-200 rounded-lg mb-2">
              <Disclosure.Button className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset flex justify-between items-center">
                <span className="font-medium text-gray-900">{item.title}</span>
                <ChevronDown
                  className={`${
                    open ? "transform rotate-180" : ""
                  } h-5 w-5 text-gray-500 transition-transform duration-200`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="px-4 py-3 bg-white">
                {item.children}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
};
