import Content from "@/components/content";
import Navbar from "@/components/navbar";
import UploadText from "@/components/upload-text";

export default function Home() {
  return (
    <div>
      <Navbar />

      <main className="px-10 py-8">
        {/* input  field */}
        <UploadText />
        <Content />
      </main>
    </div>
  );
}
