const SinhalaNumberConverter = () => {
  const [number, setNumber] = React.useState('');
  const [sinhalaWords, setSinhalaWords] = React.useState('');
  const [showDecimal, setShowDecimal] = React.useState(true);
  const [isAmount, setIsAmount] = React.useState(true);

  // Sinhala number words
  const units = [
    '', 'එක', 'දෙක', 'තුන', 'හතර', 'පහ', 'හය', 'හත', 'අට', 'නවය'
  ];
  
  const teens = [
    'දහය', 'එකොළහ', 'දොළහ', 'දහතුන', 'දහහතර', 'පහළොව', 'දහසය', 'දහහත', 'දහඅට', 'දහනවය'
  ];
  
  const tens = [
    '', 'දහය', 'විස්ස', 'තිහ', 'හතලිහ', 'පනහ', 'හැට', 'හැත්තෑව', 'අසූව', 'අනූව'
  ];
  
  // Helper functions for handling 1-99 numbers
  const convertLessThanHundred = (num) => {
    if (num === 0) {
      return 'බිංදුව';
    } else if (num < 10) {
      return units[num];
    } else if (num < 20) {
      return teens[num - 10];
    } else {
      const unit = num % 10;
      const ten = Math.floor(num / 10);
      
      if (unit === 0) {
        return tens[ten];
      } else {
        // Special cases for 21, 31, etc.
        if (unit === 1) {
          if (ten === 2) return 'විසි එක';
          if (ten === 3) return 'තිස් එක';
          if (ten === 4) return 'හතලිස් එක';
          if (ten === 5) return 'පනස් එක';
          if (ten === 6) return 'හැට එක';
          if (ten === 7) return 'හැත්තෑ එක';
          if (ten === 8) return 'අසූ එක';
          if (ten === 9) return 'අනූ එක';
        }
        
        // Standard case
        return `${tens[ten].replace(/ය$/, '')} ${unit === 1 ? 'එක' : units[unit]}`;
      }
    }
  };

  // Complete converter function
  const convertToSinhalaWords = (number, isAmount = true) => {
    if (number === 0) {
      return isAmount ? 'බිංදුව රුපියල් පමණයි' : 'බිංදුව';
    }
    
    // Split for decimal handling
    const parts = number.toString().split('.');
    const integerPart = parseInt(parts[0]);
    const decimalPart = parts.length > 1 ? parts[1] : '';
    
    // Convert integer part
    let result = '';
    
    // Handle lakhs and crores (Sri Lankan number system)
    if (integerPart >= 10000000) { // Crore (10^7)
      const crores = Math.floor(integerPart / 10000000);
      result += convertLessThanHundred(crores) + ' කෝටි ';
      const remainder = integerPart % 10000000;
      if (remainder > 0) {
        result += convertToSinhalaWords(remainder, false);
      }
      return result + (isAmount ? ' රුපියල්' + (decimalPart ? '' : ' පමණයි') : '');
    }
    
    if (integerPart >= 100000) { // Lakh (10^5)
      const lakhs = Math.floor(integerPart / 100000);
      result += convertLessThanHundred(lakhs) + ' ලක්ෂ ';
      const remainder = integerPart % 100000;
      if (remainder > 0) {
        result += convertToSinhalaWords(remainder, false);
      }
      return result + (isAmount ? ' රුපියල්' + (decimalPart ? '' : ' පමණයි') : '');
    }
    
    if (integerPart >= 1000) { // Thousand
      const thousands = Math.floor(integerPart / 1000);
      result += convertLessThanHundred(thousands) + ' දහස් ';
      const remainder = integerPart % 1000;
      if (remainder > 0) {
        result += convertToSinhalaWords(remainder, false);
      }
      return result + (isAmount ? ' රුපියල්' + (decimalPart ? '' : ' පමණයි') : '');
    }
    
    if (integerPart >= 100) { // Hundred
      const hundreds = Math.floor(integerPart / 100);
      result += units[hundreds] + ' සිය ';
      const remainder = integerPart % 100;
      if (remainder > 0) {
        result += convertToSinhalaWords(remainder, false);
      }
      return result + (isAmount ? ' රුපියල්' + (decimalPart ? '' : ' පමණයි') : '');
    }
    
    // Less than 100
    result = convertLessThanHundred(integerPart);
    
    // Add currency text if this is an amount
    if (isAmount) {
      result += ' රුපියල්' + (decimalPart ? '' : ' පමණයි');
    }
    
    // Handle decimal part for currency
    if (decimalPart && isAmount && showDecimal) {
      // Ensure we only use 2 decimal places
      const cents = parseInt(decimalPart.padEnd(2, '0').substring(0, 2));
      if (cents > 0) {
        result += ' සහ ' + convertLessThanHundred(cents) + ' සත';
      }
      result += ' පමණයි';
    }
    
    return result;
  };

  const handleConvert = () => {
    if (!number) {
      setSinhalaWords('කරුණාකර අංකයක් ඇතුලත් කරන්න');
      return;
    }
    
    try {
      const num = parseFloat(number);
      if (isNaN(num)) {
        setSinhalaWords('වලංගු අංකයක් නොවේ');
        return;
      }
      
      setSinhalaWords(convertToSinhalaWords(num, isAmount));
    } catch (error) {
      setSinhalaWords('පරිවර්තනය කිරීමේ දෝෂයකි');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">අංක සිංහල වචන බවට පරිවර්තනය කරන්න</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">අංකය ඇතුලත් කරන්න:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="උදා: 1234.56"
        />
      </div>
      
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAmount"
            checked={isAmount}
            onChange={() => setIsAmount(!isAmount)}
            className="mr-2"
          />
          <label htmlFor="isAmount">මුදල් ප්‍රමාණයක්</label>
        </div>
        
        {isAmount && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showDecimal"
              checked={showDecimal}
              onChange={() => setShowDecimal(!showDecimal)}
              className="mr-2"
            />
            <label htmlFor="showDecimal">සත පෙන්වන්න</label>
          </div>
        )}
      </div>
      
      <button
        onClick={handleConvert}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        පරිවර්තනය කරන්න
      </button>
      
      <div className="mt-6 p-4 bg-gray-100 rounded min-h-24">
        <h2 className="font-semibold mb-2">ප්‍රතිඵලය:</h2>
        <p className="text-lg">{sinhalaWords}</p>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold">භාවිතය:</h3>
        <ul className="list-disc pl-5 mt-2">
          <li>චෙක්පත් මුද්‍රණය සඳහා අංක සිංහල වචන බවට පරිවර්තනය කරන්න</li>
          <li>ලිපි හා ලේඛන සඳහා අංක වචන බවට පරිවර්තනය කරන්න</li>
          <li>රුපියල් සහ සත වෙන් කිරීමට දශම භාවිතා කරන්න (උදා: 1234.56)</li>
        </ul>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<SinhalaNumberConverter />, document.getElementById('root'));
