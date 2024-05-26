import Countdown, { zeroPad } from "react-countdown";
import { useChainmail } from "../context/ChainmailContext";

interface CountdownTimerProps {
  createdAt: bigint;
}

const DisputeCountdown: React.FC<CountdownTimerProps> = ({ createdAt }) => {
  const chainmail = useChainmail();
  const disputeDuration = chainmail?.disputeDuration;

  const targetDate = (Number(createdAt) + Number(disputeDuration)) * 1000;

  //Lets simulate a target date
  //   const targetDate = new Date();
  //   targetDate.setSeconds(targetDate.getSeconds() + 5000);
  //   console.log("targetDate", targetDate);

  //   console.log("targetDate", targetDate);
  //   console.log("listingTimeLimit", Number(listingTimeLimit));
  //   console.log("createdAt", Number(createdAt));

  console.log("targetDate", new Date(targetDate));

  if (!disputeDuration) {
    return <span>Loading...</span>;
  }

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <span className="text-text1 font-bold text-3xl">Expired</span>;
    } else if (hours > 0) {
      return (
        <span className="text-text1 font-bold text-3xl">
          {hours} hour{hours > 1 && "s"}
        </span>
      );
    } else {
      return (
        <span className="text-text1 font-bold text-3xl">
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };

  return <Countdown date={targetDate} renderer={renderer} />;
};

export default DisputeCountdown;
