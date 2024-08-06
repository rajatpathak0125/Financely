import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Cards from '../components/Cards';
import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import moment from 'moment';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard(){
  // const transactions=[
  //   {
  //     type:"income",
  //     amount:1200,
  //     tag:"salary",
  //     name:"income 1",
  //     date:"2023-5-23",
  //   },
  //   {
  //     type:"expense",
  //     amount:800,
  //     tag:"food",
  //     name:"expense 1",
  //     date:"2023-5-17",
  //   }
  // ]
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

 
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  

    async function addTransaction(transaction) {
      try {
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/transactions`),
          transaction
        );
        console.log("Document written with ID: ", docRef.id);
          toast.success("Transaction Added!");
          let newArr=transactions;
          newArr.push(transaction);
          setTransactions(newArr);
          calculateBalance();
      } catch (e) {
        console.error("Error adding document: ", e);
          toast.error("Couldn't add transaction");
      }
    }

    
  let sortedTransctions=transactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
  });
    

  return (
    <div>
      <Header/>
      {loading?(
        <p>loading....</p>
        ):(
        <>
      <Cards
      income={income}
      expenses={expenses}
      totalBalance={totalBalance}
      showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
      />
      {transactions&&transactions.length!=0?<ChartComponent sortedTransctions={sortedTransctions}/>:<NoTransactions/>}
      <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable transactions={transactions}/>
          </>)}
    </div>
  )
}


  

export default Dashboard;