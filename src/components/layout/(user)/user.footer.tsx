// 'use client'
// import { Layout } from 'antd';

// const UserFooter = () => {
//     const { Footer } = Layout;

//     return (
//         <>
//             <Footer style={{ textAlign: 'center' }}>
//                 ItranEdu ©{new Date().getFullYear()} Created by @itran
//             </Footer>
//         </>
//     )
// }

// export default UserFooter;

"use client"

const UserFooter = () => {
  return <footer className="py-6 text-center border-t">ItranEdu ©{new Date().getFullYear()} Created by @itran</footer>
}

export default UserFooter

