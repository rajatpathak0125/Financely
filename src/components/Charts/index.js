import { Line, Pie } from '@ant-design/charts';
import { Transaction } from 'firebase/firestore';
import React from 'react'

function ChartComponent({sortedTransctions}) {

    const data=sortedTransctions.map((item)=>{
        return {date:item.date,amount:item.amount};
    })

    const spendingData=sortedTransctions.filter((transaction)=>{if(transaction.type=="expense"){
        return {tag:transaction.tag,amount:transaction.amount}
    }})


 
    let newSpendings=[
        {tag:"food",amount:0},
        {tag:"education",amount:0},
        {tag:"office",amount:0},
    ];

    spendingData.forEach((item)=>{
        if(item.tag=="food"){
            newSpendings[0].amount+=item.amount;
        }else if(item.tag=="education"){
            newSpendings[1].amount+=item.amount;
        }else {
            newSpendings[2].amount+=item.amount;
        }
    });

      const config = {
        data:data,
        width:600,
        autofit:true,
        xField: 'date',
        yField: 'amount',
      };

      const spendingConfig = {
        data:newSpendings,
        width:500,
        angleField: "amount",
        colorField: "tag",
      };
      
      
  return (
    <div className='charts-wrapper'>
        <div>
            <h2 style={{marginTop:0}}>Your Analytics</h2>
            <Line {...config} />

        </div>
        <div>
            <h2>Your Spendings</h2>
            <Pie {...spendingConfig} />
        </div>
        
    </div>
  )
}

export default ChartComponent