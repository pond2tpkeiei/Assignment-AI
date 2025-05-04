export const estimateBudget = async (days: number, level: string): Promise<string> => {
    const allowedLevels = ['budget', 'standard', 'luxury'] as const;
    if (!allowedLevels.includes(level as any)) level = 'standard';
  
    const rates = {
      budget: 800,
      standard: 1500,
      luxury: 3000
    };
  
    const daily = rates[level as keyof typeof rates];
    const total = daily * days;
  
    return `
  📊 ประเมินงบสำหรับทริป ${days} วัน (ระดับ: ${level}):
  
  - ค่าใช้จ่ายต่อวัน: ${daily.toLocaleString()} บาท
  - จำนวนวัน: ${days} วัน
  💰 รวมทั้งหมด: ${total.toLocaleString()} บาท
    `.trim();
  };
  