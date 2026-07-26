$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("c:\Users\hemla\Downloads\Scaler Assignment\Scaler_SDE_Fullstack_Assignment_-_AWS_Route53_Clone.docx")
$text = $doc.Content.Text
$doc.Close()
$word.Quit()
Write-Output $text
