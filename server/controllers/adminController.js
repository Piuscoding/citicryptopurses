

const jwt = require('jsonwebtoken')
const Deposit = require("../Model/depositSchema");
const User = require("../Model/User");
const Widthdraw = require("../Model/widthdrawSchema");
const Plan = require("../Model/planSchema");
const nodemailer = require('nodemailer');


const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }


  return errors;
}


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'piuscandothis', {
    expiresIn: maxAge
  });
};


module.exports.loginAdmin_post = async(req, res) =>{
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email: email});

    if(user){
    const passwordMatch = await (password, user.password);

    if (passwordMatch) {
      
      if(!user.role == "admin"){
        res.render('login', handleErrors('Email and password is incorrect') )
      }else{
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
      }
      
    } else {
      res.render('login', handleErrors() )
    }
    } else{
      res.render('login',handleErrors() )
    }
    
  } catch (error) {
    console.log(error)
  }
    
}



// // *******************ADMIN DASHBOARD CONTROLLERS *************************//


module.exports.adminPage = async(req, res) =>{
       let perPage = 100;
  let page = req.query.page || 1;
  
  try {
    const user = await User.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    
    const count = await User.countDocuments({});
  
    res.render("adminDashboard", {
      user,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
    } 


module.exports.viewUser = async(req, res) =>{
    try {
        const user = await User.findOne({ _id: req.params.id })
        res.render("viewUser",{
          user
        })
    
      } catch (error) {
        console.log(error);
      }
    
    }
  


    module.exports.editUser = async(req, res) =>{
        try {
            const user = await User.findOne({ _id: req.params.id })
        
            res.render('editUser', {
              user
            })
        
          } catch (error) {
            console.log(error);
          }
    }


    
const sendEmail = async ( fullname,email, available,  balance, bonus, widthdrawBalance,profit,totalDeposit,totalWidthdraw,signal,verifiedStatus,level, session ) =>{
    
  try {
    const transporter =  nodemailer.createTransport({
      host: 'mail.fxlite-market.com',
      port:  465,
      auth: {
        user: 'fxlitema',
        pass: ')}Y@v~1hwuHf'
      }
  
      });
    const mailOptions = {
      from:'fxlitema@fxlite-market.com',
      to:email,
      subject: 'Dashboard Update',
      html: `<p>Greetings ${fullname},<br>Here are your availabe balances and your trading account status.<br>
      login to see your dashboard:<br>Email:${email}<br>Available balance: ${available}<br>Deposit Balance: ${balance}<br>Bonus:${bonus}<br>Widthdrawal Balance: ${widthdrawBalance}<br>Account Profit:${profit}<br>Total Deposit:${totalDeposit}<br>Total Widthdraw: ${totalWidthdraw}<br> Account Signals:${signal}<br> Verification status: ${verifiedStatus}<br>Account Level: ${level}<br>trading sessions: ${session}<br><br>You can login here: https://ameliario-crypto-officials.com/login<br>.<br>Thank you.</p>`
  }
  transporter.sendMail(mailOptions, (error, info) =>{
    if(error){
        console.log(error);
        res.send('error');
    }else{
        console.log('email sent: ' + info.response);
        res.send('success')
    }
})
}catch (error) {
  console.log(error.message);
}

}



module.exports.editUser_post = async(req, res) =>{
    try {
        await User.findByIdAndUpdate(req.params.id,{
          fullname: req.body.fullname,
          tel: req.body.tel,
          email: req.body.email,
          country: req.body.country,
          gender: req.body.gender,
          level: req.body.level,
          session: req.body.session,
          balance: req.body.balance,
          account_name: req.body.account_name,
          account_no: req.body.account_no,
          available: req.body.available,
          bonus: req.body.bonus,
          refBonus: req.body.refBonus,
          widthdrawBalance: req.body.widthdrawBalance,
          profit: req.body.profit,
          totalDeposit: req.body.totalDeposit,
          totalWidthdraw: req.body.totalWidthdraw,
           btc_add: req.body.btc_add,
           eth_add: req.body.eth_add,
           usdt_add: req.body.usdt_add,
          verifiedStatus:req.body.verifiedStatus,
          
          updatedAt: Date.now()
        });

          //  if(User){
          // sendEmail(req.body.fullname,req.body.email, req.body.available, req.body.balance, req.body.bonus,req.body.widthdrawBalance, req.body.profit, req.body.totalDeposit,req.body.totalWidthdraw,req.body.signal, req.body.verifiedStatus,req.body.level, req.body.session )
          // }else{
          //   console.log(error);
          // }
          await res.redirect(`/editUser/${req.params.id}`);
          
          console.log('redirected');
      } catch (error) {
        console.log(error);
      }
    
}


module.exports.deletePage = async(req, res) =>{
  try {
    await User.deleteOne({ _id: req.params.id });
      res.redirect("/adminRoute")
    } catch (error) {
      console.log(error);
    }
}

// // *******************ALL DEPOSITS CONTROLLERS *************************//

module.exports.allDeposit = async(req, res) =>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const deposit = await Deposit.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
     

      res.render('allFunding',{
        deposit
      });

    } catch (error) {
      console.log(error);
    } 
}

module.exports.viewDeposit = async(req, res) =>{
    try {
        const deposit = await Deposit.findOne({ _id: req.params.id })
    
        res.render('viewDeposits',{
          deposit
        })
    
      } catch (error) {
        console.log(error);
      }

}

module.exports.editDeposit = async(req, res) =>{
    try {
        const deposit = await Deposit.findOne({ _id: req.params.id })
    
        res.render('editDeposit',{
          deposit
        })
    
      } catch (error) {
        console.log(error);
      }
  
}

module.exports.editDeposit_post  = async(req, res) =>{
    try {
        await Deposit.findByIdAndUpdate(req.params.id,{
          payment_method: req.body.payment_method,
          amount: req.body.amount,
          status: req.body.status,
          updatedAt: Date.now()
        });
        await res.redirect(`/editDeposit/${req.params.id}`);
        
        console.log('redirected');
      } catch (error) {
        console.log(error);
      }
    
}

module.exports.deleteDeposit = async(req, res) =>{
    try {
        await Deposit.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoute")
      
    } catch (error) {
        console.log(error)
    }
    
}

// // // *******************ALL WIDTHDRAWALS  CONTROLLERS *************************//

module.exports.allWidthdrawal = async(req, res) =>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const widthdraw = await Widthdraw.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      // const count = await Widthdraw.count();

      res.render('allWidthdrawals',{
        widthdraw
      });

    } catch (error) {
      console.log(error);
    } 
}


module.exports.viewWidthdrawal = async(req, res) =>{
    try {
        const widthdraw = await Widthdraw.findOne({ _id: req.params.id })
    
        res.render('viewWidthdrawals',{widthdraw})
    
      } catch (error) {
        console.log(error);
      }
}


module.exports.editWidthdrawal = async(req, res) =>{
    try {
        const widthdraw = await Widthdraw.findOne({ _id: req.params.id })
    
        res.render('editWidthdrawals',{
          widthdraw
        })
    
      } catch (error) {
        console.log(error);
      }
}

module.exports.editWidthdrawal_post = async(req, res) =>{
    try {
        await Widthdraw.findByIdAndUpdate(req.params.id,{
          amount: req.body.amount,
          type: req.body.type,
          status: req.body.status,
          updatedAt: Date.now()
        });
        await res.redirect(`/editWidthdrawals/${req.params.id}`);
        
        console.log('redirected');
      } catch (error) {
        console.log(error);
      }
    
}

module.exports.deleteWidthdraw = async(req, res) =>{
    try {
        await Widthdraw.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoute")
      
    } catch (error) {
        console.log(error)
    }
}

// // // *******************INVESTMENT PLAN CONTROLLERS *************************//

module.exports.allPlanPage = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const plan = await Plan.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allplans',{
      plan
    });

  } catch (error) {
    console.log(error);
  } 
}

module.exports.viewPlanPage = async(req, res)=>{
  try {
    const plan = await Plan.findOne({ _id: req.params.id })

res.render('viewallPlans',{
    plan
})
      } catch (error) {
        console.log(error);
      }
}


module.exports.editPlanPage = async(req, res)=>{
  try {
    const plan = await Plan.findOne({ _id: req.params.id })

res.render('editallPlan',{
  plan
})
      } catch (error) {
        console.log(error);
      }
}

module.exports.editPlanPage_post = async(req, res)=>{
  try {
    await Plan.findByIdAndUpdate(req.params.id,{
   type: req.body.type,
    amount: req.body.amount,
    number: req.body.number,
    status: req.body.status,
    updatedAt: Date.now()
    });
    await res.redirect(`/edit-plan/${req.params.id}`);
    
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deletePlan = async(req, res)=>{
  try {
    await Plan.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}




// // // *******************ACCOUNT UPGRADES CONTROLLERS *************************//

// module.exports.allupgradesPage = async(req, res)=>{
//   let perPage = 100;
//   let page = req.query.page || 1;

//   try {
//     const upgrade = await Upgrade.aggregate([ { $sort: { createdAt: -1 } } ])
//       .skip(perPage * page - perPage)
//       .limit(perPage)
//       .exec(); 
//     // const count = await Widthdraw.count();

//     res.render('allAccountsUpgrade',{
//       upgrade
//     });

//   } catch (error) {
//     console.log(error);
//   } 
// }


// module.exports.viewUprgadesPage = async(req, res)=>{

//   try {
//     const upgrade = await Upgrade.findOne({ _id: req.params.id })

// res.render('viewallAccountsUpgrade',{
//   upgrade
// })

//       } catch (error) {
//         console.log(error);
//       }
// }

// module.exports.editUpgradesPage = async(req, res)=>{
//   try {
//     const upgrade = await Upgrade.findOne({ _id: req.params.id })

// res.render('editallAccountsUpgrade',{
//   upgrade
// })
//       } catch (error) {
//         console.log(error);
//       }
// }

// module.exports.editUpgrade_post  = async(req, res)=>{
//   try {
//     await Upgrade.findByIdAndUpdate(req.params.id,{
//       amount: req.body.amount,
//       method: req.body.method,
//       status: req.body.status,
//       updatedAt: Date.now()
//     });
//     await res.redirect(`/editUpgrade/${req.params.id}`);
    
//     console.log('redirected');
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports.deleteUpgrade = async(req, res)=>{
//   try {
//     await Upgrade.deleteOne({ _id: req.params.id });
//     res.redirect("/adminRoute")
  
// } catch (error) {
//     console.log(error)
// }
// }
