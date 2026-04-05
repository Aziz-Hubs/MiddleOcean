import { getTranslations } from "next-intl/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { FileQuestion } from "lucide-react"

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound")

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <Badge variant="outline" className="text-muted-foreground">
            {t("errorCode")}
          </Badge>
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="size-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-px w-full bg-border" />
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button>{t("backHome")}</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">{t("exploreProducts")}</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
