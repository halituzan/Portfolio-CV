import { useTheme } from "@/app/Configs/ThemeContext";
import { useState } from "react";
import { Icon } from "@iconify/react";
import XLSX from "xlsx";
const Kelimeler = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [nonMatchingWords, setNonMatchingWords] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<string>("");

  const fetchWords = async () => {
    const response = await fetch("/api/words");
    if (!response.ok) {
      throw new Error("Error fetching words");
    }
    const data = await response.json();
    return data;
  };

  const handleButtonClick = async () => {
    setLoading(true); // Show loading
    setMatches([]); // Clear previous matches
    setNonMatchingWords([]); // Clear previous non-matching words
    setCsvData(""); // Clear previous CSV data

    try {
      const data = await fetchWords();
      const wordInput = (
        document.getElementById("words") as HTMLTextAreaElement
      ).value;
      const list = wordInput.split("\n");

      const foundMatches: any = [];
      const nonMatching: any = [];

      list.forEach((word) => {
        let matchFound = false;
        data.forEach((item: any) => {
          if (item.madde.toLowerCase() === word.trim().toLowerCase()) {
            foundMatches.push(item);
            matchFound = true;
          }
        });

        if (!matchFound) {
          nonMatching.push(word.trim());
        }
      });

      setMatches(foundMatches);
      setNonMatchingWords(nonMatching);

      // CSV Output
      if (foundMatches.length) {
        const maxMeaningsCount = 17; // Limit the number of meanings to 17
        const headerRow = ["kelime"];
        for (let i = 1; i <= maxMeaningsCount; i++) {
          headerRow.push(`anlam${i}`);
        }

        const rows = [headerRow]; // Add header row

        foundMatches.forEach((match: any) => {
          const row = [match.madde];
          match.anlamlarListe
            .slice(0, maxMeaningsCount)
            .forEach((meaning: any) => {
              row.push(meaning.anlam);
            });

          // Fill missing columns with empty strings
          for (let i = match.anlamlarListe.length; i < maxMeaningsCount; i++) {
            row.push(""); // Fill missing columns with empty strings
          }

          rows.push(row);
        });

        const csvString = rows.map((row) => row.join(",")).join("\n");
        setCsvData(csvString);
      }
    } catch (error) {
      console.error("Error during processing:", error);
    }

    setLoading(false); // Hide loading
  };
  const handleDownload = () => {
    const rows = csvData.split("\n").map((row) => row.split(","));
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Words");
    XLSX.writeFile(wb, "words.xlsx");
  };

  return (
    <div className='p-10 flex flex-col w-full'>
      <div className='mb-4'>
        <h1 className='leading-none md:leading-3 md:text-[2.25rem] text-[1.8rem]'>
          Kelime Anlamları Convert Aracı
        </h1>
        <p className='mb:text-[1.8rem] text-[10px]'>
          Satır atlayarak girdiğiniz kelimeleri TDK datası ile karşılaştırarak
          dataset içinde bulunan kelimelerin anlamlarını bularak excel çıktısı
          olarak alabileceğiniz bir ara yazılımdır.{" "}
        </p>
      </div>
      <div className='flex w-full self-stretch flex-1 h-full'>
        <div className='flex-1'>
          <label
            htmlFor='words'
            className={`${
              theme === "dark" ? "text-light5" : "text-dark5"
            } block font-medium mb-2 md:text-[1rem] text-[10px]`}
          >
            Kelimeler
          </label>
          <textarea
            id='words'
            cols={100}
            className='block md:text-[1rem] text-[10px] p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-full'
            placeholder='Kelimeleri satır atlayarak girin...'
          ></textarea>
        </div>

        <div className='md:w-[260px] flex items-start mt-10 justify-center px-1 md:px-10 flex-1 md:flex-none'>
          <button
            className={`${
              theme === "dark" ? "bg-dark3 text-light5" : "bg-light6 text-dark5"
            } border rounded-lg py-2 md:text-[1rem] text-[10px] md:px-4 px-1`}
            onClick={handleButtonClick}
            disabled={loading}
          >
            {loading ? (
              <div className='relative w-full md:text-[1rem] text-[10px]'>
                <p className='loading-text md:text-[1rem] text-[10px]'>
                  Dönüştürülüyor
                </p>
                <span className='dots'></span>
              </div>
            ) : (
              <div className='w-full'>Dönüştür</div>
            )}
          </button>
        </div>

        <div className='self-stretch flex flex-col flex-1'>
          <div className='md:flex-1 flex flex-col'>
            <label
              htmlFor='message'
              className={`${
                theme === "dark" ? "text-light5" : "text-dark5"
              } block md:text-[1rem] text-[10px] font-medium mb-2`}
            >
              TDK'da Olanlar
            </label>
            <textarea
              id='message'
              cols={100}
              value={matches.map((match) => match.madde).join("\n")}
              readOnly
              className='block p-2.5 w-full md:text-[1rem] text-[10px] text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-[100px] md:h-full'
            ></textarea>
            <div className='w-full flex justify-end md:text-[1rem] text-[10px] my-2'>
              <button
                className={`${
                  theme === "dark"
                    ? "bg-green-600 text-light5"
                    : "bg-green-600 text-light5"
                } border rounded-lg py-2 px-2 md:px-4 md:text-[1rem] text-[10px] items-center justify-center w-full md:w-auto`}
                onClick={handleDownload}
                style={{ display: matches.length > 0 ? "flex" : "none" }}
              >
                Xlsx İndir{" "}
                <Icon
                  icon='ri:file-download-fill'
                  className={`md:text-[24px] ml-1 text-[10px]`}
                />
              </button>
            </div>
          </div>

          <div className='flex flex-col md:flex-1'>
            <label
              htmlFor='message'
              className={`${
                theme === "dark" ? "text-light5" : "text-dark5"
              } block md:text-[1rem] text-[10px] font-medium mb-2`}
            >
              TDK'da Olmayanlar
            </label>
            <textarea
              id='message'
              cols={100}
              value={nonMatchingWords.join("\n")}
              readOnly
              className='block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-full self-stretch'
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kelimeler;
