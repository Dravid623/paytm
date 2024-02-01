import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { SubHeading } from "../components/SubHeading"
import { useNavigate } from "react-router-dom"

export const Home = () => {
    const navigate = useNavigate();
  return (
    <div>
      <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Paytm"} />
            <SubHeading
              label={"Simple and Incredible."}
            />
            <SubHeading
              label={"Paytm Karo."}
            />
            <div className="pt-4">
              <Button
                onClick={() => {
                  navigate("/Signin");
                }}
                label={"Sign in"}
              />
              <Button
                onClick={() => {
                  navigate("/Signup");
                }}
                label={"Sign up"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
