export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            {/* Placeholder for logo - we'll add the actual SVG */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <div className="text-6xl">📖</div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-6xl md:text-7xl font-bold text-foreground">
          MyLegacyLife.AI
        </h1>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Preserve your life's stories for future generations
        </p>

        {/* Description */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Share your memories through voice and stories. Create a beautiful hardcover book for your family with weekly prompts and AI assistance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
          <a href="/demo" className="btn-voice-primary no-underline">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            Try Voice Recording Demo
          </a>

          <a
            href="#learn-more"
            className="px-8 py-4 text-xl font-medium text-foreground border-2 border-border rounded-lg hover:bg-muted transition-colors min-h-[56px] flex items-center no-underline"
          >
            Learn More
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
          <div className="p-6 rounded-xl bg-card border-2 border-border">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-2xl font-serif font-semibold mb-3">
              Voice-First
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Simply speak your stories. No typing required. We make it easy and natural.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border-2 border-border">
            <div className="text-4xl mb-4">🌳</div>
            <h3 className="text-2xl font-serif font-semibold mb-3">
              Family Tree
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect your stories to your family tree. Three generations of memories in one place.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border-2 border-border">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-serif font-semibold mb-3">
              Beautiful Book
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your stories become a stunning hardcover book. A treasure for generations.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div id="learn-more" className="mt-20 text-left max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-8 text-center">
            How It Works
          </h2>

          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-2">
                  Receive Weekly Questions
                </h4>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every week, we'll send you a thoughtful question about your life via email.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-2">
                  Record Your Answer
                </h4>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Tap the microphone and speak naturally. Or type if you prefer. Add photos to illustrate your stories.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-2">
                  Get Your Book
                </h4>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  After one year, your stories become a beautiful hardcover book. Order copies for your whole family.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-border">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Ready to preserve your legacy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start sharing your stories today. Your family will treasure them forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/demo" className="btn-voice-primary max-w-md mx-auto no-underline">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Begin Your Story
            </a>
            <a href="/questions">
              <button className="px-8 py-4 text-xl font-medium text-foreground border-2 border-border rounded-lg hover:bg-muted transition-colors min-h-[56px]">
                View All Questions
              </button>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-border text-center">
          <p className="text-lg text-muted-foreground">
            © 2026 MyLegacyLife.AI. Preserving memories for future generations.
          </p>
        </footer>
      </div>
    </div>
  );
}
