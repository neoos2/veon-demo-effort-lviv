// Facts for the homepage. Source: veon/client.json (ids in comments). Nothing here is invented.
export const phones = {
  sales: { href: "tel:+380673333500", label: "+38 067 3333 500", role: "Відділ продажу" }, // company.contacts.phones[0]
  office: { href: "tel:+380322989340", label: "+38 032 298 93 40", role: "Головний офіс" }, // phones[1], S-008
  support: { href: "tel:+380800333350", label: "0 800 3333 50", role: "Технічна підтримка" }, // phones[4]
} as const;

export const email = { href: "mailto:effort-service@effort.com.ua", label: "effort-service@effort.com.ua" }; // emails[0]

export const address = {
  line: "вул. Героїв УПА, 72, Львів, 79018", // addresses[0], S-008
  map: "https://www.google.com/maps/search/?api=1&query=%D0%B2%D1%83%D0%BB.+%D0%93%D0%B5%D1%80%D0%BE%D1%97%D0%B2+%D0%A3%D0%9F%D0%90%2C+72%2C+%D0%9B%D1%8C%D0%B2%D1%96%D0%B2+79018",
};

export const soon = "Розділ у розробці";

/** Hero «scale ladder»: from a flat to a freight train. level 1…6 drives width (wdth) and weight of the type. */
export const ladder = {
  home: [
    { name: "Квартира", meta: "пульт від 330 грн/міс", level: 1 }, // S-006
    { name: "Будинок, котедж", meta: "пульт від 450 грн/міс", level: 2 }, // S-006
  ],
  business: [
    { name: "Магазин, павільйон", meta: "пульт від 450 грн/міс", level: 3 }, // S-006
    { name: "Заправна станція", meta: "38 уже під охороною", level: 4 }, // S-003
    { name: "Нафтобаза", meta: "12 уже під охороною", level: 5 }, // S-003
    { name: "Вантаж у дорозі", meta: "супровід залізничних вантажів", level: 6 }, // S-009, business_lines
  ],
};

export const scale = [
  { value: "5080", label: "об'єктів під охороною" }, // S-001
  { value: "1200", label: "працівників охорони" },
  { value: "14", label: "областей України" },
  { value: "19", label: "років на ринку" },
];

export const cities = ["Львів", "Стрий", "Дрогобич", "Трускавець", "Борислав", "Стебник", "Східниця", "Винники", "Чернівці"]; // S-005
