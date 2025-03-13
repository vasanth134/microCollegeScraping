// import Search from "../components/Search";
import Marquee from "react-fast-marquee";

export default function Hero() {
  return (
    <main className="h-screen">
      <div className="flex flex-col gap-7 pt-8 items-center">
        <h1 className="text-4xl font-semibold tracking-wide text-center text-wrap mx-20 leading-snug">
          Start Your Career Journey: Explore <br />
          the Best Fresher Jobs Here!
        </h1>
        <p className="text-xl font-bold text-center">
          connect students with leading companies and find the perfect job to
          kick start career
        </p>
      </div>
      <div className="flex justify-center py-10">
        {/* <Search /> */}
      </div>
      <div className="flex flex-col gap-10 mt-10">
        <Marquee gradient={false} autoFill={true} pauseOnHover={true}>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Front-End
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Front-End dev
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Back-End dev
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Dev-Ops
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Business Analytics
            </div>
          </a>
        </Marquee>
        <Marquee
          gradient={false}
          autoFill={true}
          pauseOnHover={true}
          speed={70}
        >
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Digital Marketing
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              SAP
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Banking & Finance
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Data Analytics & Data Scientist
            </div>
          </a>
          <a href="">
            <div className="px-4 py-3 mx-10 font-medium text-xl bg-white inline-block rounded border-2 drop-shadow-sm">
              Cyber Security
            </div>
          </a>
        </Marquee>
      </div>
    </main>
  );
}
