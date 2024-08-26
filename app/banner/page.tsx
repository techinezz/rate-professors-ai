import ShineBorder from "@/components/magicui/shine-border";

const ShineBorderPage = () => {
  return (
    <ShineBorder
      className="relative flex h-[300px] w-[1200px] flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-500/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Rate Professors AI
      </span>
    </ShineBorder>
  );
}


export default ShineBorderPage;
