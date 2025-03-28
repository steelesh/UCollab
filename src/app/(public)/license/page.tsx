import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1, H3 } from "~/components/ui/heading";
import { Large } from "~/components/ui/large";
import { TypographyLink } from "~/components/ui/link";
import { Muted } from "~/components/ui/muted";
import { P } from "~/components/ui/p";
import { Section } from "~/components/ui/section";
import { Small } from "~/components/ui/small";

export const metadata = {
  title: "UCollab — License",
};

export default function Page() {
  return (
    <Container as="article" size="4xl">
      <PageBreadcrumb
        items={[
          { label: "License", isCurrent: true },
        ]}
      />
      <Header>
        <H1>License Agreement</H1>
        <Muted>
          <Small>
            Last Updated:
            {" "}
            March 7th, 2025
          </Small>
        </Muted>
        <P className="italic">This project is licensed under the MIT License. By using this software, you agree to the following terms.</P>
      </Header>
      <Section>
        <H3 noMargin>MIT License</H3>
        <Card variant="glossy" className="p-4 max-w-2xl">
          <pre className="whitespace-pre-wrap text-sm">
            {`MIT License

Copyright (c) 2024 UCollab Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`}
          </pre>
        </Card>
      </Section>

      <Section>
        <Large>📜 Usage and Distribution</Large>
        <Muted>
          This software can be freely used, modified, and distributed under the terms of the MIT License. However, all
          copies of the software must include the original license text.
        </Muted>
      </Section>

      <Section>
        <Large>⚠️ Disclaimer</Large>
        <Muted>
          This software is provided "as is," without warranty of any kind, express or implied, including but not limited
          to the warranties of merchantability, fitness for a particular purpose, and noninfringement.
        </Muted>
      </Section>

      <Section className="text-center mt-20">
        <Muted>
          <Small>
            Have questions? Reach out at
            {" "}
            <TypographyLink href="mailto:support@ucollab.com">support@ucollab.com</TypographyLink>
            .
          </Small>
        </Muted>
      </Section>
    </Container>
  );
}
