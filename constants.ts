import { Phase, AgendaItem, TeamDefinition } from './types';

// Define IDs as constants for internal consistency in this file
const TEAM_BOOK = 'COMMITTEE_BOOK';
const TEAM_PROCUREMENT = 'COMMITTEE_PROCUREMENT';
const TEAM_INSPECTION = 'COMMITTEE_INSPECTION';
const TEAM_VENDOR = 'VENDOR';
const TEAM_FINANCE = 'FINANCE';

export const INITIAL_TEAMS: TeamDefinition[] = [
  { 
    id: TEAM_BOOK, 
    name: 'คณะกรรมการจัดทำหนังสือ', 
    description: 'รวบรวมข้อมูล จัดทำต้นฉบับ และพิสูจน์อักษร',
    color: 'bg-indigo-100 text-indigo-700'
  },
  { 
    id: TEAM_PROCUREMENT, 
    name: 'คณะกรรมการจัดจ้าง', 
    description: 'ดำเนินการจัดซื้อจัดจ้างและกำหนด TOR',
    color: 'bg-blue-100 text-blue-700'
  },
  { 
    id: TEAM_INSPECTION, 
    name: 'คณะกรรมการตรวจรับ', 
    description: 'ตรวจสอบความถูกต้องและอนุมัติรับมอบงาน',
    color: 'bg-emerald-100 text-emerald-700'
  },
  { 
    id: TEAM_VENDOR, 
    name: 'ผู้รับจ้างผลิต', 
    description: 'โรงพิมพ์/ผู้รับจ้างพิมพ์และเข้าเล่ม',
    color: 'bg-rose-100 text-rose-700'
  },
  { 
    id: TEAM_FINANCE, 
    name: 'การเงิน/บัญชี', 
    description: 'งบการเงิน บัญชี และการตรวจสอบ',
    color: 'bg-amber-100 text-amber-700'
  }
];

export const INITIAL_PROJECT_PHASES: Phase[] = [
  {
    id: 1,
    name: "ระยะที่ 1: การเตรียมการและการวางแผน",
    period: "1 พ.ย. 68 – 31 ธ.ค. 68",
    description: "เตรียมความพร้อมด้านทรัพยากร งบประมาณ และโครงสร้างพื้นฐาน",
    tasks: [
      {
        id: "1.1",
        title: "จัดจ้างโรงพิมพ์ (TOR)",
        description: "ออก TOR พิมพ์ 4,000 เล่ม, ระบุเวลาผลิต 14 วันทำการ, กำหนดค่าปรับ",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
        team: TEAM_PROCUREMENT,
        responsiblePerson: "ประธานจัดจ้าง",
        status: "Pending",
        progress: 0,
        isMilestone: true,
        logs: []
      },
      {
        id: "1.2",
        title: "เตรียมต้นฉบับภาคบรรยาย",
        description: "รวบรวมสารจากประธาน, ประวัติกรรมการ, ภาพกิจกรรม",
        startDate: "2025-11-01",
        endDate: "2025-12-31",
        team: TEAM_BOOK,
        responsiblePerson: "เลขานุการคณะทำงาน",
        status: "Pending",
        progress: 0,
        logs: []
      },
      {
        id: "1.3",
        title: "ประสานงานผู้สอบบัญชี",
        description: "เชิญตรวจสอบงวดระหว่างกาล และกำหนดวันตรวจงวดสุดท้าย",
        startDate: "2025-12-01",
        endDate: "2025-12-31",
        team: TEAM_FINANCE,
        responsiblePerson: "หัวหน้าฝ่ายบัญชี",
        status: "Pending",
        progress: 0,
        logs: []
      }
    ]
  },
  {
    id: 2,
    name: "ระยะที่ 2: การปิดบัญชีและการตรวจสอบ (Critical)",
    period: "2 ม.ค. 69 – 4 ก.พ. 69",
    description: "ช่วงเวลาวิกฤต ห้ามล่าช้า กระทบวันพิมพ์",
    tasks: [
      {
        id: "2.1",
        title: "ปิดบัญชีเบื้องต้น",
        description: "บันทึกรายการปรับปรุง ยืนยันยอดลูกหนี้/ทุนเรือนหุ้น",
        startDate: "2026-01-02",
        endDate: "2026-01-15",
        team: TEAM_FINANCE,
        responsiblePerson: "หัวหน้าฝ่ายบัญชี",
        status: "Pending",
        progress: 0,
        logs: []
      },
      {
        id: "2.2",
        title: "ตรวจสอบบัญชีภาคสนาม",
        description: "ผู้สอบบัญชีเข้าตรวจสอบเอกสาร ณ สำนักงาน",
        startDate: "2026-01-16",
        endDate: "2026-01-25",
        team: TEAM_FINANCE,
        responsiblePerson: "ผู้สอบบัญชี",
        status: "Pending",
        progress: 0,
        logs: []
      },
      {
        id: "2.3",
        title: "อนุมัติงบการเงินและจัดสรรกำไร",
        description: "ประชุม กก. พิจารณาร่างงบฯ และจัดสรรกำไร (ปันผล)",
        startDate: "2026-01-26",
        endDate: "2026-01-30",
        team: TEAM_BOOK,
        responsiblePerson: "คณะกรรมการดำเนินการ",
        status: "Pending",
        progress: 0,
        isMilestone: true,
        logs: []
      },
      {
        id: "2.4",
        title: "ลงนามในรายงานผู้สอบบัญชี",
        description: "รับมอบรายงานฉบับสมบูรณ์ (Content Freeze)",
        startDate: "2026-02-01",
        endDate: "2026-02-04",
        team: TEAM_FINANCE,
        responsiblePerson: "ผู้สอบบัญชี",
        status: "Pending",
        progress: 0,
        isMilestone: true,
        logs: []
      }
    ]
  },
  {
    id: 3,
    name: "ระยะที่ 3: การผลิตและจัดพิมพ์",
    period: "5 ก.พ. 69 – 25 ก.พ. 69",
    description: "กระบวนการพิมพ์ 14 วันทำการ (Day-to-day Management)",
    tasks: [
      {
        id: "3.1",
        title: "รวมเล่มและส่งไฟล์ (Final Assembly)",
        description: "รวมงบการเงินกับภาคบรรยาย, พิสูจน์อักษรครั้งสุดท้าย",
        startDate: "2026-02-05",
        endDate: "2026-02-06",
        team: TEAM_BOOK,
        responsiblePerson: "เลขานุการคณะทำงาน",
        status: "Pending", 
        progress: 0,
        isMilestone: true,
        logs: []
      },
      {
        id: "3.2a",
        title: "ตรวจปรู๊ฟสี (Digital Proof)",
        description: "โรงพิมพ์ส่งปรู๊ฟ คณะกรรมการตรวจรับอนุมัติใน 24 ชม.",
        startDate: "2026-02-09",
        endDate: "2026-02-11",
        team: TEAM_INSPECTION,
        responsiblePerson: "ประธานตรวจรับ",
        status: "Pending",
        progress: 0,
        logs: []
      },
      {
        id: "3.2b",
        title: "พิมพ์เนื้อในและเข้าเล่ม",
        description: "พิมพ์, เข้าเล่ม, ตัดเจียน",
        startDate: "2026-02-12",
        endDate: "2026-02-25",
        team: TEAM_VENDOR,
        responsiblePerson: "โรงพิมพ์",
        status: "Pending",
        progress: 0,
        logs: []
      }
    ]
  },
  {
    id: 4,
    name: "ระยะที่ 4: การจัดส่งและกระจายหนังสือ",
    period: "26 ก.พ. 69 – 5 มี.ค. 69",
    description: "ส่งหนังสือถึงสมาชิกก่อนประชุม (ระวังวันหยุดมาฆบูชา 3 มี.ค.)",
    tasks: [
      {
        id: "4.1",
        title: "รับมอบงานและ E-Book",
        description: "รับหนังสือ 4,000 เล่ม, ปล่อย E-Book ขึ้น Web/Line",
        startDate: "2026-02-26",
        endDate: "2026-02-26",
        team: TEAM_INSPECTION,
        responsiblePerson: "คณะกรรมการตรวจรับ",
        status: "Pending",
        progress: 0,
        isMilestone: true,
        logs: []
      },
      {
        id: "4.2",
        title: "กระจายหนังสือ (EMS/หน่วยงาน)",
        description: "แจกจ่ายหน่วยงาน และส่ง EMS ให้ทันก่อนวันหยุด",
        startDate: "2026-02-27",
        endDate: "2026-02-28",
        team: TEAM_BOOK,
        responsiblePerson: "ฝ่ายธุรการ",
        status: "Pending",
        progress: 0,
        logs: []
      }
    ]
  },
  {
    id: 5,
    name: "ระยะที่ 5: วันประชุมใหญ่สามัญ (AGM)",
    period: "13 มี.ค. 69",
    description: "วันแห่งความสำเร็จ",
    tasks: [
      {
        id: "5.1",
        title: "ประชุมใหญ่สามัญประจำปี 2568",
        description: "เตรียมจุดลงทะเบียน, หนังสือสำรอง, สื่อนำเสนอ",
        startDate: "2026-03-13",
        endDate: "2026-03-13",
        team: TEAM_BOOK,
        responsiblePerson: "เลขานุการ",
        status: "Pending",
        progress: 0,
        isMilestone: true,
        logs: []
      }
    ]
  }
];

export const INITIAL_AGENDA_ITEMS: AgendaItem[] = [
  // Introduction Section
  { id: "1", title: "สารจากผู้อำนวยการท่าเรือแห่งประเทศไทย", responsibleTeam: TEAM_BOOK, responsiblePerson: "เลขานุการ", status: "Drafting", logs: [] },
  { id: "2", title: "สารจากประธานกรรมการ", responsibleTeam: TEAM_BOOK, responsiblePerson: "เลขานุการ", status: "Drafting", logs: [] },
  { id: "3", title: "สารจากผู้จัดการ", responsibleTeam: TEAM_BOOK, responsiblePerson: "ผู้จัดการ", status: "Drafting", logs: [] },
  { id: "4", title: "คณะกรรมการดำเนินการ ชุดที่ 19 และคณะผู้ตรวจสอบกิจการ", responsibleTeam: TEAM_BOOK, responsiblePerson: "ธุรการ", status: "Drafting", logs: [] },
  { id: "5", title: "คณะกรรมการและคณะอนุกรรมการ", responsibleTeam: TEAM_BOOK, responsiblePerson: "ธุรการ", status: "Drafting", logs: [] },
  { id: "6", title: "เจ้าหน้าที่สหกรณ์", responsibleTeam: TEAM_BOOK, responsiblePerson: "ธุรการ", status: "Drafting", logs: [] },
  { id: "7", title: "ศูนย์ประสานงานฌาปนกิจสงเคราะห์", responsibleTeam: TEAM_BOOK, responsiblePerson: "จนท.ฌาปนกิจ", status: "Drafting", logs: [] },
  { id: "8", title: "ภาพกิจกรรม", responsibleTeam: TEAM_BOOK, responsiblePerson: "ธุรการ/PR", status: "Drafting", logs: [] },
  { id: "9", title: "ผลการดำเนินงานประจำปี 2567", responsibleTeam: TEAM_BOOK, responsiblePerson: "ผู้จัดการ", status: "Drafting", logs: [] },
  { id: "10", title: "แผนกลยุทธ์", responsibleTeam: TEAM_BOOK, responsiblePerson: "ฝ่ายแผนงาน", status: "Drafting", logs: [] },
  
  // AGM Agenda
  { id: "11", title: "หนังสือเชิญประชุมใหญ่สามัญ ประจำปี 2567", responsibleTeam: TEAM_BOOK, responsiblePerson: "เลขานุการ", status: "Drafting", logs: [] },
  { id: "12", title: "ระเบียบวาระที่ 1: เรื่อง ประธานแจ้งให้ที่ประชุมทราบ", responsibleTeam: TEAM_BOOK, responsiblePerson: "ประธาน/เลขาฯ", status: "Drafting", logs: [] },
  { id: "13", title: "ระเบียบวาระที่ 2: รับรองรายงานการประชุมใหญ่สามัญ ประจำปี 2566", responsibleTeam: TEAM_BOOK, responsiblePerson: "เลขานุการ", status: "Drafting", logs: [] },
  { id: "14", title: "ระเบียบวาระที่ 3: เรื่อง การครบวาระของกรรมการดำเนินการชุดที่ 19", responsibleTeam: TEAM_BOOK, responsiblePerson: "กก.สรรหา", status: "Drafting", logs: [] },
  
  // Agenda 4: Information
  { id: "15", title: "4.1 เรื่อง รายงานผลการดำเนินงานของสหกรณ์ ประจำปี 2567", responsibleTeam: TEAM_BOOK, responsiblePerson: "ผู้จัดการ", status: "Drafting", logs: [] },
  { id: "16", title: "4.2 เรื่อง การรับสมาชิกใหม่และการขาดจากสมาชิกภาพ ประจำปี 2567", responsibleTeam: TEAM_BOOK, responsiblePerson: "งานสมาชิก", status: "Drafting", logs: [] },
  { id: "17", title: "4.3 เรื่อง รายงานการตรวจสอบกิจการ ประจำปี 2567", responsibleTeam: TEAM_BOOK, responsiblePerson: "ผู้ตรวจสอบกิจการ", status: "Drafting", logs: [] },
  { id: "18", title: "4.4 เรื่อง ผลประโยชน์และค่าตอบแทนที่ได้รับจากสหกรณ์ ประจำปี 2567", responsibleTeam: TEAM_FINANCE, responsiblePerson: "บัญชี", status: "Drafting", logs: [] },
  { id: "19", title: "4.5 เรื่อง เงินรอตรวจสอบ", responsibleTeam: TEAM_FINANCE, responsiblePerson: "บัญชี", status: "Drafting", logs: [] },
  { id: "20", title: "4.6 เรื่อง ผลการดำเนินการของสันนิบาตสหกรณ์", responsibleTeam: TEAM_BOOK, responsiblePerson: "เลขานุการ", status: "Drafting", logs: [] },

  // Agenda 5: Consideration
  { id: "21", title: "5.1 เรื่อง พิจารณาอนุมัติงบการเงิน ประจำปี 2567", responsibleTeam: TEAM_FINANCE, responsiblePerson: "ผู้สอบบัญชี", status: "Drafting", logs: [] },
  { id: "22", title: "5.2 เรื่อง พิจารณาอนุมัติการจัดสรรกำไรสุทธิ ประจำปี 2567", responsibleTeam: TEAM_FINANCE, responsiblePerson: "บัญชี/ผู้จัดการ", status: "Drafting", logs: [] },
  { id: "23", title: "5.3 เรื่อง ขออนุมัติงบประมาณการรายได้และงบประมาณรายจ่าย ประจำปี 2568", responsibleTeam: TEAM_FINANCE, responsiblePerson: "บัญชี", status: "Drafting", logs: [] },
  { id: "24", title: "5.4 เรื่อง คัดเลือกผู้สอบบัญชีและกำหนดค่าธรรมเนียมการตรวจสอบ ประจำปี 2568", responsibleTeam: TEAM_FINANCE, responsiblePerson: "บัญชี", status: "Drafting", logs: [] },
  { id: "25", title: "5.5 เรื่อง พิจารณาการเงินหรือการลงทุน ประจำปี 2568", responsibleTeam: TEAM_BOOK, responsiblePerson: "กก.การลงทุน", status: "Drafting", logs: [] },
  { id: "26", title: "5.6 เรื่อง ขออนุมัติวงเงินกู้ยืมหรือค้ำประกันของสหกรณ์ ประจำปี 2568", responsibleTeam: TEAM_FINANCE, responsiblePerson: "การเงิน", status: "Drafting", logs: [] },
  { id: "27", title: "5.7 เรื่อง ขอความเห็นชอบแผนกลยุทธ์ ประจำปี 2568", responsibleTeam: TEAM_BOOK, responsiblePerson: "ฝ่ายแผนงาน", status: "Drafting", logs: [] },
  { id: "28", title: "5.8 เรื่อง การสมัครเป็นสมาชิกชุมนุมสหกรณ์ออมทรัพย์รัฐวิสาหกิจไทย จำกัด", responsibleTeam: TEAM_BOOK, responsiblePerson: "ผู้จัดการ", status: "Drafting", logs: [] },
  { id: "29", title: "5.9 เรื่อง ขออนุมัติโอนเงินรอตรวจสอบเข้าทุนสำรองในปี 2568", responsibleTeam: TEAM_FINANCE, responsiblePerson: "บัญชี", status: "Drafting", logs: [] },
  { id: "30", title: "5.10 เรื่อง ขออนุมัติซื้อหุ้นธนาคารกรุงไทย", responsibleTeam: TEAM_BOOK, responsiblePerson: "กก.การลงทุน", status: "Drafting", logs: [] },

  // Agenda 6 & 7
  { id: "31", title: "ระเบียบวาระที่ 6: เรื่อง รายงานผลการเลือกตั้งคณะกรรมการดำเนินการ ชุดที่ 20", responsibleTeam: TEAM_BOOK, responsiblePerson: "กก.เลือกตั้ง", status: "Drafting", logs: [] },
  { id: "32", title: "ระเบียบวาระที่ 7: เรื่อง รายงานศูนย์ประสานงานฌาปนกิจสงเคราะห์ ประจำปี 2567", responsibleTeam: TEAM_BOOK, responsiblePerson: "จนท.ฌาปนกิจ", status: "Drafting", logs: [] }
];