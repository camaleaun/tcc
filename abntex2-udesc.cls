%%
%% Customizações do abnTeX2 (http://abnTeX2.googlecode.com) para a Universidade XXXX
%%
%% This work may be distributed and/or modified under the
%% conditions of the LaTeX Project Public License, either version 1.3
%% of this license or (at your option) any later version.
%% The latest version of this license is in
%%   http://www.latex-project.org/lppl.txt
%% and version 1.3 or later is part of all distributions of LaTeX
%% version 2005/12/01 or later.
%%
%% This work has the LPPL maintenance status `maintained'.
%%
%% The Current Maintainer of this work is SEU_NOME, SEU_EMAIL
%%
%% Further information about abnTeX2 are available on http://abntex2.googlecode.com/
%%

% ---
% INICIO DAS CUSTOMIZACOES PARA A UDESC
% ---

\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{abntex2-udesc}[2016/10/30 v1.0 Modelo da Universidade Brasil baseado em abnTeX2]

%
% Repassa todos os parametros a classe abntex2,
\DeclareOption*{%
  \PassOptionsToClass{\CurrentOption}{abntex2}%
}
\ProcessOptions\relax
\LoadClass{abntex2}

\providecommand{\insereinstituicao}{}
\renewcommand{\instituicao}[1]{\renewcommand{\insereinstituicao}{#1}}

\renewcommand*{\chaptitlefont}{\bfseries\rmfamily}


\RequirePackage{titlesec}
\titleformat{\section}[block]
  {\normalfont}{\uppercase{\thesection}}{1em}{\MakeUppercase}
\titleformat{\subsection}[block]
  {\normalfont\bfseries}{\thesubsection}{1em}{}
%\titlespacing{\section}{12pc}{1.5ex plus .1ex minus .2ex}{1pc}
%\titleformat{\subsection}
%  {\normalfont\fontsize{12}{15}\bfseries}{\subsectionNumber~\thesubsection}{1em}{}

% Comandos de dados - orientador
\newcommand{\orientadoraname}{Orientadora:}
\providecommand{\imprimirorientadoraRotulo}{}
\providecommand{\imprimirorientadora}{}
\newcommand{\orientadora}[2][\orientadoraname]%
  {\renewcommand{\imprimirorientadoraRotulo}{#1}%
   \renewcommand{\imprimirorientadora}{#2}}

\providecommand{\inserecentro}{}
\newcommand{\centro}[1]{\renewcommand{\inserecentro}{#1}}

\providecommand{\inserecurso}{}
\newcommand{\curso}[1]{\renewcommand{\inserecurso}{#1}}

\providecommand{\insereuf}{}
\newcommand{\uf}[1]{\renewcommand{\insereuf}{#1}}

\providecommand{\insereano}{}
\newcommand{\ano}[1]{\renewcommand{\insereano}{#1}}

\providecommand{\inserecidade}{}
\newcommand{\cidade}[1]{\renewcommand{\inserecidade}{#1}}

% alterando a capa
\renewcommand{\imprimircapa}{%%
  \begin{capa}%
    \center
    \bfseries\MakeTextUppercase{\insereinstituicao}

    \bfseries\MakeTextUppercase{\inserecentro}

    \bfseries\MakeTextUppercase{\inserecurso}

    \vspace*{4cm}
    {\bfseries\MakeTextUppercase{\imprimirautor}}

    \vspace*{4cm}
    \begin{center}
    \bfseries\Large\MakeTextUppercase{\imprimirtitulo}
    \end{center}
    \vfill

    {\normalfont\textnormal\imprimirlocal}

    {\normalfont\textnormal\imprimirdata}

    \vspace*{1cm}
  \end{capa}
}

\renewcommand{\folhaderostocontent}{
  \begin{center}

    %\vspace*{1cm}
    {\bfseries\MakeTextUppercase{\imprimirautor}}

    \vspace*{\fill}\vspace*{\fill}
    \begin{center}
      \bfseries\Large\MakeTextUppercase{\imprimirtitulo}
    \end{center}
    \vspace*{\fill}

    \abntex@ifnotempty{\imprimirpreambulo}{%
      \hspace{.45\textwidth}
      \begin{minipage}{.5\textwidth}
      	\SingleSpacing
         \imprimirpreambulo
       \end{minipage}%
    }%

    \vspace{\onelineskip}

    \vspace{\onelineskip}

    \hspace{.45\textwidth}
    \abntex@ifnotempty{\imprimirorientador}{%
      \begin{minipage}{.5\textwidth}
        \imprimirorientadorRotulo~\imprimirorientador\par
      \end{minipage}%
    }%
    \abntex@ifnotempty{\imprimirorientadora}{%
      \begin{minipage}{.5\textwidth}
        \imprimirorientadoraRotulo~\imprimirorientadora\par
      \end{minipage}%
    }%
    \abntex@ifnotempty{\imprimircoorientador}{%
      \begin{minipage}{.5\textwidth}
        \imprimircoorientadorRotulo~\imprimircoorientador
      \end{minipage}%
    }%
    \vspace*{\fill}

    {\imprimirlocal}
    \par
    {\imprimirdata}
    \vspace*{1cm}

  \end{center}
}

\setlength{\ABNTEXsignthickness}{.5pt}

\newcommand{\assinaturaorientador}[1]{%
  \parbox[t]{\textwidth - 4cm}{\SingleSpacing%
  \rule{\textwidth - 4cm}{\ABNTEXsignthickness}\\%
  \nopagebreak\textnormal #1\par}%
}

\makeatletter
\let\oldcontentsline\contentsline
\def\contentsline#1#2{%
	\expandafter\ifx\csname l@#1\endcsname\l@section
	\expandafter\@firstoftwo
	\else
	\expandafter\@secondoftwo
	\fi
	{%
		\oldcontentsline{#1}{\MakeTextUppercase{#2}}%
	}{%
	\oldcontentsline{#1}{#2}%
}%
}
\makeatother

%\renewcommand{\ABNTEXsectionfontsize}{\bfseries\normalsize}

%\renewcommand{\ABNTEXchapterfontsize}{\bfseries\Large}

%%% Fonts
\renewcommand{\cftchapterfont}{\rmfamily\bfseries}
%\MakeUppercase
%\patchcmd{\l@section}{#1}{\MakeTextUppercase{#1}}{}{}
\renewcommand{\cftsectionfont}{\rmfamily}
\renewcommand{\cftsubsectionfont}{\rmfamily\bfseries}
\renewcommand{\cftsubsubsectionfont}{\rmfamily\bfseries}

% TODO Ajustar tabulação no sumários

%\settocdepth{subsubsection}
%\settocdepth{section}
%\setsecnumdepth{subsubsection}
%\setsecnumdepth{section}

\setlength{\cftbeforechapterskip}{0em}

\makeatletter
\def\ifdraft{\ifdim\overfullrule>\z@
  \expandafter\@firstoftwo\else\expandafter\@secondoftwo\fi}
\makeatother

% Novo list of (listings) para QUADROS

\newcommand{\quadroname}{Quadro}
\newcommand{\listofquadrosname}{Lista de quadros}

\newfloat[chapter]{quadro}{loq}{\quadroname}
\newlistof{listofquadros}{loq}{\listofquadrosname}
\newlistentry{quadro}{loq}{0}

% configurações para atender às regras da ABNT
\counterwithout{quadro}{chapter}
\renewcommand{\cftquadroname}{\quadroname\space}
\renewcommand*{\cftquadroaftersnum}{\hfill--\hfill}

\newcolumntype{L}[1]{>{\raggedright\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{C}[1]{>{\centering\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{R}[1]{>{\raggedleft\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}

\setlength{\parindent}{1.3cm}

\setlength{\parskip}{0.2cm}

\setlength\afterchapskip{\lineskip}

\setlength\aftersecskip{\lineskip}
\setlength\aftersubsecskip{\lineskip}
