import React from 'react';

const WhalesTable = ({ loading, whaleData }) => {
  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <table className="text-left text-white transactions-table w-full">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="px-4 py-2">Hash</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Sender</th>
            <th className="px-4 py-2">To</th>
            <th className="px-4 py-2">Block Height</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {!loading && whaleData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-800">
              <td className="ellipsis px-4 py-2 ">
                {item.transactionHash}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{parseFloat(item.amount).toFixed(2)} BNB</td>
              <td className="ellipsis px-4 py-2 ">
                {item.from}
              </td>
              <td className="ellipsis px-4 py-2">
                {item.to}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{item.blockHeight}</td>
            </tr>
          ))}
          {loading && (
            <tr className="hover:bg-gray-800">
              <td colspan={5} className="px-4 py-2 text-center">
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WhalesTable;
