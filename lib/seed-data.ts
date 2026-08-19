import type { AccessType, Language, ResourceType } from "./types";

export const CATEGORY_SEED: { name: string; description: string }[] = [
  { name: "Business Administration", description: "Strategy, operations, leadership, and organizational behavior." },
  { name: "Management Information Systems", description: "Information systems that support decision-making in organizations." },
  { name: "Project Management", description: "Planning, execution, and delivery of scoped work and initiatives." },
  { name: "Computer Science", description: "Algorithms, software systems, and computing theory." },
  { name: "Information Technology", description: "IT infrastructure, networks, and enterprise technology operations." },
  { name: "Engineering", description: "Applied engineering principles across disciplines." },
  { name: "Economics", description: "Micro and macroeconomic theory and analysis." },
  { name: "Accounting", description: "Financial reporting, auditing, and accounting standards." },
  { name: "Finance", description: "Corporate finance, investment, and financial markets." },
  { name: "Digital Transformation", description: "Technology-driven change in organizations and business models." },
  { name: "Data Management", description: "Data governance, storage, quality, and analytics practices." },
];

export const AUTHOR_SEED: { name: string; biography: string }[] = [
  { name: "Dr. Amina Farouk", biography: "Associate professor of business strategy with a focus on emerging markets." },
  { name: "Prof. James Whitfield", biography: "Researcher in information systems and enterprise architecture." },
  { name: "Dr. Layla Haddad", biography: "Project management scholar and certified program lead." },
  { name: "Prof. Michael Chen", biography: "Computer scientist specializing in distributed systems." },
  { name: "Dr. Omar El-Sayed", biography: "IT infrastructure researcher and network security lecturer." },
  { name: "Prof. Sophie Bergman", biography: "Mechanical engineering professor focused on sustainable design." },
  { name: "Dr. Youssef Karim", biography: "Economist studying regional trade and development policy." },
  { name: "Prof. Elena Petrova", biography: "Accounting faculty member specializing in financial reporting standards." },
  { name: "Dr. Rania Aziz", biography: "Finance researcher covering corporate valuation and capital markets." },
  { name: "Prof. David Okafor", biography: "Digital transformation consultant turned academic." },
  { name: "Dr. Noura Al-Mansoori", biography: "Data governance specialist and applied data science instructor." },
  { name: "Prof. Thomas Becker", biography: "Software engineering lecturer with a focus on systems reliability." },
  { name: "Dr. Hassan Ibrahim", biography: "Operations management researcher and industrial engineer." },
  { name: "Prof. Grace Lindqvist", biography: "Organizational behavior scholar studying leadership and teams." },
  { name: "Dr. Fatima Zahra", biography: "Applied economics researcher focused on public policy analysis." },
];

interface ResourceSeed {
  title: string;
  description: string;
  resource_type: ResourceType;
  author: number; // index into AUTHOR_SEED
  category: number; // index into CATEGORY_SEED
  publication_year: number;
  language: Language;
  access_type: AccessType;
  featured?: boolean;
}

export const RESOURCE_SEED: ResourceSeed[] = [
  { title: "Foundations of Strategic Management", description: "An introduction to strategic planning frameworks used by modern organizations.", resource_type: "E-Book", author: 0, category: 0, publication_year: 2021, language: "English", access_type: "Open Access", featured: true },
  { title: "Leadership Across Cultures", description: "A comparative study of leadership styles in multinational organizations.", resource_type: "Research Paper", author: 13, category: 0, publication_year: 2020, language: "English", access_type: "Open Access" },
  { title: "Organizational Change in Practice", description: "Case studies on managing change initiatives inside large enterprises.", resource_type: "Educational Resource", author: 0, category: 0, publication_year: 2019, language: "English", access_type: "Demo" },
  { title: "Enterprise Architecture Fundamentals", description: "A practical guide to aligning IT systems with business strategy.", resource_type: "E-Book", author: 1, category: 1, publication_year: 2022, language: "English", access_type: "Licensed", featured: true },
  { title: "Decision Support Systems in the Enterprise", description: "How organizations design systems that support managerial decision-making.", resource_type: "Journal Article", author: 1, category: 1, publication_year: 2018, language: "English", access_type: "Open Access" },
  { title: "Information Systems Adoption Patterns", description: "A thesis examining why organizations adopt new information systems at different rates.", resource_type: "Thesis", author: 1, category: 1, publication_year: 2023, language: "English", access_type: "Restricted" },
  { title: "Agile Project Delivery Handbook", description: "A practitioner's overview of agile methods for scoped project delivery.", resource_type: "E-Book", author: 2, category: 2, publication_year: 2022, language: "English", access_type: "Open Access", featured: true },
  { title: "Risk Management in Complex Projects", description: "Lecture notes covering risk identification and mitigation techniques.", resource_type: "Lecture Material", author: 2, category: 2, publication_year: 2020, language: "English", access_type: "Demo" },
  { title: "Scheduling and Resource Allocation", description: "Techniques for planning timelines and allocating limited project resources.", resource_type: "Educational Resource", author: 12, category: 2, publication_year: 2019, language: "English", access_type: "Open Access" },
  { title: "Distributed Systems: Principles and Practice", description: "An overview of consistency, replication, and fault tolerance in distributed computing.", resource_type: "E-Book", author: 3, category: 3, publication_year: 2023, language: "English", access_type: "Open Access", featured: true },
  { title: "Algorithmic Complexity Revisited", description: "A research paper surveying modern approaches to analyzing algorithm efficiency.", resource_type: "Research Paper", author: 3, category: 3, publication_year: 2021, language: "English", access_type: "Open Access" },
  { title: "Software Reliability Engineering", description: "A thesis on measuring and improving reliability in large software systems.", resource_type: "Thesis", author: 11, category: 3, publication_year: 2022, language: "English", access_type: "Licensed" },
  { title: "Introduction to Data Structures", description: "A foundational course pack covering common data structures and their tradeoffs.", resource_type: "Lecture Material", author: 3, category: 3, publication_year: 2018, language: "English", access_type: "Demo" },
  { title: "Enterprise Network Security Essentials", description: "A guide to securing enterprise networks against common attack vectors.", resource_type: "E-Book", author: 4, category: 4, publication_year: 2021, language: "English", access_type: "Restricted" },
  { title: "Cloud Infrastructure Cost Optimization", description: "A journal article examining strategies for controlling cloud infrastructure spend.", resource_type: "Journal Article", author: 4, category: 4, publication_year: 2023, language: "English", access_type: "Open Access" },
  { title: "IT Service Management in Practice", description: "An educational resource on applying ITSM frameworks to daily operations.", resource_type: "Educational Resource", author: 4, category: 4, publication_year: 2020, language: "English", access_type: "Demo" },
  { title: "Sustainable Engineering Design", description: "Principles for designing engineering systems with reduced environmental impact.", resource_type: "E-Book", author: 5, category: 5, publication_year: 2022, language: "English", access_type: "Open Access", featured: true },
  { title: "Materials Selection for Mechanical Systems", description: "Lecture material on choosing materials based on mechanical performance criteria.", resource_type: "Lecture Material", author: 5, category: 5, publication_year: 2019, language: "English", access_type: "Demo" },
  { title: "Thermodynamics in Applied Engineering", description: "A research paper reviewing thermodynamic models used in industrial engineering.", resource_type: "Research Paper", author: 5, category: 5, publication_year: 2020, language: "English", access_type: "Open Access" },
  { title: "أساسيات الاقتصاد الكلي", description: "مقدمة في مبادئ الاقتصاد الكلي وتطبيقاتها على الأسواق النامية.", resource_type: "E-Book", author: 6, category: 6, publication_year: 2021, language: "Arabic", access_type: "Open Access" },
  { title: "Trade Policy and Regional Development", description: "An economics thesis analyzing the effects of trade policy on regional growth.", resource_type: "Thesis", author: 6, category: 6, publication_year: 2023, language: "English", access_type: "Restricted" },
  { title: "Behavioral Economics: A Primer", description: "An accessible overview of how psychology shapes economic decision-making.", resource_type: "Educational Resource", author: 14, category: 6, publication_year: 2018, language: "English", access_type: "Demo" },
  { title: "Financial Reporting Standards Explained", description: "A practical walkthrough of core financial reporting standards for practitioners.", resource_type: "E-Book", author: 7, category: 7, publication_year: 2022, language: "English", access_type: "Licensed" },
  { title: "Audit Practices in Modern Organizations", description: "A journal article surveying audit methodology used by contemporary firms.", resource_type: "Journal Article", author: 7, category: 7, publication_year: 2020, language: "English", access_type: "Open Access" },
  { title: "Cost Accounting Fundamentals", description: "Lecture material covering cost classification and allocation methods.", resource_type: "Lecture Material", author: 7, category: 7, publication_year: 2019, language: "English", access_type: "Demo" },
  { title: "Corporate Valuation Methods", description: "An overview of discounted cash flow and comparable company valuation techniques.", resource_type: "E-Book", author: 8, category: 8, publication_year: 2023, language: "English", access_type: "Open Access", featured: true },
  { title: "التمويل الشخصي والاستثمار", description: "دليل تمهيدي حول إدارة الأموال الشخصية ومبادئ الاستثمار الأساسية.", resource_type: "Educational Resource", author: 8, category: 8, publication_year: 2021, language: "Arabic", access_type: "Demo" },
  { title: "Digital Business Model Innovation", description: "A research paper exploring how digital technology reshapes business models.", resource_type: "Research Paper", author: 9, category: 9, publication_year: 2022, language: "English", access_type: "Open Access" },
  { title: "Leading Digital Transformation Programs", description: "A practitioner's e-book on sequencing and governing transformation programs.", resource_type: "E-Book", author: 9, category: 9, publication_year: 2023, language: "English", access_type: "Licensed" },
  { title: "Data Governance Frameworks", description: "A guide to establishing data ownership, quality, and stewardship practices.", resource_type: "E-Book", author: 10, category: 10, publication_year: 2022, language: "English", access_type: "Open Access", featured: true },
];
